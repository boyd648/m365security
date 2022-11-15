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

  let pages = pageFiles.map(pageFile => {
    const data = require(path.join(__dirname, '..', pageFile))
    data.pageFile = pageFile
    return data
  })

  pages = pages.map(page => {
    page.pages = pages.filter(p => !(p.pageFile === page.pageFile || p.pageFile === './src/pages/404.js'))
    return page
  })
  for (let i = 0; i < pages.length; i++) {
    const data = pages[i]
    const outputPath = path.join(__dirname, '..', data.pageFile.replace('src/\pages', 'docs').replace('.js', '.html'))
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
