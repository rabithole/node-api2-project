const express = require('express');
const Posts = require('../data/db.js');

const router = express.Router();

//  is used to name this file for routing...
// router in router.get refers to the const router above. 

router.post('/', (req, res) => {
  console.log(req.body.contents, req.body.title)
  console.log(req.body.contents === undefined || req.body.title === undefined)

  Posts.insert({ title: req.body.title, contents: req.body.contents })
  .then(post => {
    if (req.body.contents && req.body.title) {
      res.status(201).json(post);  
    } else {
      res.status(404).json({ errorMessage: "Please provide title and contents for the post." })
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

router.post('/:id/comments', (req, res) => {
  console.log('Posting:', req.params, req.body )

  Posts.findById(req.params.id).then(post_id => {
    if(post_id === undefined) {
      res.status(401).json({ message: "The post with the specified ID does not exist." })
    } else {
     Posts.insertComment({ text: req.body.text, post_id: req.params.id })
      .then(post => {
        console.log('post:', post)
        if (!req.body.text) {
          // res.status(200).json(post);
          res.status(404).json({ errorMessage: "Please provide text for the comment." });
        } else {
          res.status(201).json(post);
        }
      })
      .catch(error => {
        // log error to database
        console.log(error);
        res.status(500).json({
          message: 'Error creating the post',
        });
      });  
    }
}) 



 
});

router.get('/', (req, res) => {
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
  console.log('Get post by id')
  Posts.findById(req.params.id)
  .then(post => {
    console.log(post)
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

router.get('/:id/comments', (req, res) => {
  console.log('Get post comments by id', req.params.id)
  Posts.findPostComments(req.params.id)
  .then(post => {
    // console.log('this is post', post)
    if (post.length > 0) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'The post with the specified ID does not exist.' });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: 'The comments information could not be retrieved.',
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

router.put('/:id', (req, res) => {
  console.log('Put to change a post...')
  const changes = req.body;
 
  Posts.update(req.params.id, changes)
  .then(post => {
    console.log(req.params.id === post + 1, req.params.id, post)
    if (!post) {
      res.status(404).json({ message: 'The post with the specified ID does not exist.' });
    } else if (req.body.contents && req.body.title) {
      res.status(200).json(post);
    } 
    else {
      res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' });
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