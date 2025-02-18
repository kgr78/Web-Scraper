PORT = 2400 //seeing something

const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')

const app = express()

const url = 'https://www.hypedc.com/nz/categories/sale/mens/mens-sale-footwear?pid=nav-sale'

axios(url)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        const shoes = []
        
        $('.w-1/2 px-2 py-2 lg:px-4 lg:py-4 xl:w-1/4', html).each(function() {
            const data = $(this).text()
            const url = $(this).find('a').attr('href')

            shoes.push({
                data, 
                url
            })
        })
        console.log(shoes)
    }).catch(err => console.log(err))

app.listen(PORT, () => console.log('server running on PORT ' + PORT))