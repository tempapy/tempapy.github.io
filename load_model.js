

async function app() {
  console.log('Loading model...');
  const model = await tf.loadLayersModel('https://raw.githubusercontent.com/tempapy/tempapy.github.io/master/model/model.json');
  console.log('Loaded');
}

app();