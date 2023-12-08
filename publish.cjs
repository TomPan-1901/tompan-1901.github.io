var ghpages = require('gh-pages')
ghpages.publish('.output/public', function(err) {
  if (err) {
    console.log(err)
  } else {
    console.log('Published!')
  }
})