const Dev = require('../models/Dev');
const ParseStringAsArray = require('../utils/ParseStringAsArray');

module.exports = {
    async index(req, res) {
        let { latitude, longitude, techs } = req.query;
        techs = ParseStringAsArray(techs);

        const devs = await Dev.find({
            techs: {
                $in: techs
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 10000
                }
            }
        });

        return res.json({devs});
    }
}