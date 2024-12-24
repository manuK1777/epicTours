// Tables Relationships
import { sequelize } from '../db.js';
import Artist from './artistModel.js';
import Event from './eventModel.js';
import Location from './locationModel.js';
import Contact from './contactModel.js';
import Musician from './musicianModel.js';
import Crew from './crewModel.js';
import User from './userModel.js';
import RecoveryToken from './recoveryTokenModel.js';

// Define associations
const defineAssociations = () => {
  // Artist associations
  Artist.belongsToMany(Event, { 
    through: 'ArtistEvents',
    foreignKey: 'artist_id',
    otherKey: 'event_id'
  });
  Artist.belongsToMany(Location, { 
    through: 'ArtistVenues',
    foreignKey: 'artist_id',
    otherKey: 'venue_id'
  });
  Artist.hasMany(Musician, {
    foreignKey: 'artist_id',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });
  Artist.hasMany(Crew, {
    foreignKey: 'artist_id',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });
  Artist.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });

  // Event associations
  Event.belongsToMany(Artist, { 
    through: 'ArtistEvents',
    foreignKey: 'event_id',
    otherKey: 'artist_id'
  });
  Event.belongsTo(Location, {
    foreignKey: 'venue_id',
    as: 'venue',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });

  // Location (Venue) associations
  Location.hasMany(Contact, {
    foreignKey: 'venue_id',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });
  Location.belongsToMany(Artist, { 
    through: 'ArtistVenues',
    foreignKey: 'venue_id',
    otherKey: 'artist_id'
  });

  // Contact associations
  Contact.belongsTo(Location, {
    foreignKey: 'venue_id',
    as: 'venue',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });

  // Musician associations
  Musician.belongsTo(Artist, {
    foreignKey: 'artist_id',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });

  // Crew associations
  Crew.belongsTo(Artist, {
    foreignKey: 'artist_id',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });

  // User associations
  User.hasMany(Artist, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });
  User.hasOne(RecoveryToken, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // RecoveryToken associations
  RecoveryToken.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
};

// Initialize associations
defineAssociations();

// Export models
export {
  Artist,
  Event,
  Location,
  Contact,
  Musician,
  Crew,
  User,
  RecoveryToken,
  sequelize
};