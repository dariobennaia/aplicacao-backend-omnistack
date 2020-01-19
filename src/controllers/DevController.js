const axios = require('axios');
const Dev = require('../models/Dev');
const ParseStringAsArray = require('../utils/ParseStringAsArray');

const responseApiGitHub = async (github_username) => {
    const { data } = await axios.get(`https://api.github.com/users/${github_username}`);
    return data;
}

module.exports = {
    async index(req, res) {
        const devs = await Dev.find();
        return res.json(devs);
    },
    async create(req, res) {
        const { github_username, techs, latitude, longitude } = req.body;
    
        let dev = await Dev.findOne({ github_username });

        if (dev) {
            return res.json(dev);
        }

        const { 
            name = login,
            avatar_url,
            bio = "Nenhuma Biografia informada"
        } = await responseApiGitHub(github_username);

        const techsArray = ParseStringAsArray(techs);
        const location = {
            type: 'Point',
            coordinates: [longitude, latitude]
        }
    
        dev = await Dev.create({
            github_username,
            name,
            avatar_url,
            bio,
            techs: techsArray,
            location
        });
    
        return res.json(dev);
    }
}