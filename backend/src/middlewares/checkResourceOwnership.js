// src/middlewares/checkResourceOwnership.js
import Artist from '../models/artistModel.js';

export const checkArtistOwnership = async (req, res, next) => {
    try {
        const artistId = req.params.id || req.body.artist_id;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Admins can access all artists
        if (userRole === 'admin') {
            return next();
        }

        // For managers, check if they own the artist
        if (userRole === 'manager') {
            const artist = await Artist.findOne({
                where: {
                    id: artistId,
                    user_id: userId
                }
            });

            if (!artist) {
                return res.status(403).json({
                    code: -10,
                    message: 'You do not have permission to access this artist'
                });
            }
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: -100,
            message: 'An error occurred while checking resource ownership'
        });
    }
};

export const checkEventOwnership = async (req, res, next) => {
    try {
        const eventId = req.params.id || req.body.event_id;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Admins can access all events
        if (userRole === 'admin') {
            return next();
        }

        // For managers, check if the event is related to their artists
        if (userRole === 'manager') {
            const artistEvent = await ArtistEvents.findOne({
                include: [{
                    model: Artist,
                    where: { user_id: userId }
                }],
                where: { event_id: eventId }
            });

            if (!artistEvent) {
                return res.status(403).json({
                    code: -10,
                    message: 'You do not have permission to access this event'
                });
            }
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: -100,
            message: 'An error occurred while checking event ownership'
        });
    }
};
