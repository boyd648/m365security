const fs = require('fs')
const glob = require('glob')
const ejs = require('ejs')
const path = require('path')
const copydir = require('copy-dir')

const build = async () => {
  deleteDocs()
  copyRoot()
  
  const pageFiles = glob.sync('./src/pages/**/*.js')
  const template = fs.readFileSync(`${__dirname}\\page.ejs`, 'utf8')

  for (let i = 0; i < pageFiles.length; i++) {
    const pageFile = pageFiles[i]
    const data = require(path.join(__dirname, '..', pageFile))
    const outputPath = path.join(__dirname, '..', pageFile.replace('src/\pages', 'docs').replace('.js', '.html'))
    const content = ejs.render(template, data)

    fs.writeFileSync(outputPath, content)
  }
}

const deleteDocs = () => {
  if (fs.existsSync('./docs'))
    fs.rmSync('./docs',  {recursive: true})

  fs.mkdirSync('./docs')
}

const copyRoot = () => {
  copydir.sync('./src/root', './docs')
}

build()
