const express = require('express');
const Posts = require('../data/db.js');

const router = express.Router();

//  is used to name this file for routing...
// router in router.get refers to the const router above. 
router.get('/', (req, res) => {
  // res.send(`
  //   <h2>Watch out, your going the wrong way!</h>
  //   <p>Welcome to your worst nightmare!</p>
  // `);
  Posts.find(req.query)
  .then(posts => {
    res.status(200).json(posts);
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: 'The posts information could not be retrieved.',
    });
  });
});

router.get('/:id', (req, res) => {
  Posts.findById(req.params.id)
  .then(post => {
    // console.log(post)
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'The post with the specified ID does not exist' });
      }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: 'The post information could not be retrieved.',
    });
  });
});

router.delete('/:id', (req, res) => {
  Posts.remove(req.params.id)
  .then(post => {
    if (post > 0) {
      res.status(200).json({ message: 'The post has been nuked' });
    } else {
      res.status(404).json({ message: 'The post with the specified ID does not exist.' });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: 'The post could ot be removed.',
    });
  });
});

// router.get('/:id/comments', (req, res) => {
//   console.log(req.params.id)
//   Posts.findPostComments(req.params.id)
//   .then(post => {
//     if (post) {
//       res.status(200).json(post);
//     } else {
//       res.status(404).json({ message: 'post not found' });
//     }
//   })
//   .catch(error => {
//     // log error to database
//     console.log(error);
//     res.status(500).json({
//       message: 'Error retrieving the post',
//     });
//   });
// });

router.get('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await Posts.findCommentsById(id);
    res.status(200).json(comments);
  } catch (error) {
    // log error to database
    res.status(500).json({
      message: 'Error finding your comment!',
    });
  }
});

router.post('/', (req, res) => {
  Posts.insert(req.body)
  .then(post => {
    if(post){
      res.status(201).json(post);  
    } else {
      res.status(400).json({ errorMessage: "Please provide title and contents for the post."})
    }
    
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: 'There was an error while saving the post to the database.',
    });
  });
});

router.put('/:id', (req, res) => {
  const changes = req.body;
  Posts.update(req.params.id, changes)
  .then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'The post with the specified ID does not exist.' });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: 'The post information could not be modified.',
    });
  });
});

module.exports = router;