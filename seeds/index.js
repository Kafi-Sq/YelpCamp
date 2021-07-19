const Campground = require('../models/campgrounds')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.once('open', () => { console.log('Database Connected!') })
db.on('error', (err) => { console.log('Error', err) })

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: '60f5d1f5d4ded81c8c274c07',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(places)} ${sample(descriptors)}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/nbrvchhc/image/upload/v1626724543/YelpCamp/lywatfosmgujrqgvoibb.jpg',
                  filename: 'YelpCamp/lywatfosmgujrqgvoibb'
                },
                {
                  url: 'https://res.cloudinary.com/nbrvchhc/image/upload/v1626724543/YelpCamp/xqtesmmahrzeols1brws.jpg',
                  filename: 'YelpCamp/xqtesmmahrzeols1brws'
                }
              ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, nisi',
            price
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})
