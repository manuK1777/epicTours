import { param } from 'express-validator';

export const validateEventId = [
    param('id')
        .isInt()
        .withMessage('Event ID must be an integer'),
];

export const validateArtistId = [
    param('id')
        .isInt()
        .withMessage('Artist ID must be an integer'),
];

export const validateVenueId = [
    param('id')
        .isInt()
        .withMessage('Venue ID must be an integer'),
];
