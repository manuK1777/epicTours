import { User, Artist, Location, Event, VenueBooker, Musician, Crew } from './models/index.js';
import { sequelize } from './db.js';
import bcrypt from 'bcrypt';

const insertInitialData = async () => {
  try {
    // 1. Create Users
    const users = await User.bulkCreate([
      {
        username: 'manager0',
        email: 'manager0@epictours.com',
        password: await bcrypt.hash('manager123', 10),
        role: 'manager',
      },
      {
        username: 'manager1',
        email: 'manager1@epictours.com',
        password: await bcrypt.hash('manager123', 10),
        role: 'manager',
      },
      {
        username: 'admin',
        email: 'admin@epictours.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
      }
    ], { returning: true });

    // 2. Create Artists (with user_id)
    const kiss = await Artist.create({
        name: 'Kiss',
        email: 'kiss@example.com',
        contact: 'Gene Simmons',
        phone: '1234567890',
        webPage: 'https://kissonline.com',
        file: '1737143738968.jpg',
        user_id: users[0].id
    });

    const motleyCrue = await Artist.create({
        name: 'Motley Crüe',
        email: 'motleycrue@example.com',
        contact: 'Nikki Sixx',
        phone: '0987654321',
        webPage: 'https://motleycrue.com',
        file: 'file-1733419702838.jpeg',
        user_id: users[1].id
    });

    const twistedSister = await Artist.create({
        name: 'Twisted Sister',
        email: 'twistedsister@example.com',
        contact: 'Petra',
        phone: '1122334455',
        webPage: null,
        file: 'file-1734468978943.jpeg',
        user_id: users[1].id
    });

    // 3. Create Locations/Venues
    const locations = await Location.bulkCreate([
      {
        name: 'Sunset Jazz Club',
        category: 'Jazz Club',
        address: 'C/ Jaume Pons i Martí, 12. 17004 Girona',
        latitude: 41.98892750,
        longitude: 2.82423590,
      },
      {
        name: 'Palau de la Música Catalana',
        category: 'general',
        address: 'Carrer Palau de la Música, 4-6, 08003, Barcelona',
        latitude: 41.38736166,
        longitude: 2.17505422,
      },
      {
        name: 'Nova Jazz Cava',
        category: 'Jazz Venue',
        address: 'Passatge Tete Montoliu, 24, Terrassa',
        latitude: 41.56406,
        longitude: 2.01395,
      },
      {
        name: 'Jamboree',
        category: 'Jazz Club',
        address: 'Pl. Reial, 17, Barcelona',
        latitude: 41.37971,
        longitude: 2.17519,
      }
    ], { returning: true });

    // 4. Create Venue Bookers
    await VenueBooker.bulkCreate([
      {
        venue_id: locations[0].id,
        name: 'Alex',
        email: 'info@sunsetjazz.net',
        phone: '678945321'
      },
      {
        venue_id: locations[2].id,
        name: 'Susanna',
        email: 'info@jazzterrassa.com',
        phone: '68876352'
      },
      {
        venue_id: locations[3].id,
        name: 'Josep Mestres',
        email: 'jamboree@jamboree.com',
        phone: '68638094'
      }
    ]);

    // 5. Create Musicians for Artists
    await Musician.bulkCreate([
      {
        name: 'Paul Stanley',
        instrument: 'Guitar/Vocals',
        email: 'paul@kiss.com',
        phone: '15550101',
        file: 'paul-stanley.jpg',
        artist_id: kiss.id
      },
      {
        name: 'Gene Simmons',
        instrument: 'Bass/Vocals',
        email: 'gene@kiss.com',
        phone: '15550102',
        file: 'gene-simmons.jpg',
        artist_id: kiss.id
      },
      {
        name: 'Vince Neil',
        instrument: 'Vocals',
        email: 'vince@motleycrue.com',
        phone: '15550201',
        file: 'vince-neil.jpg',
        artist_id: motleyCrue.id
      },
      {
        name: 'Mick Mars',
        instrument: 'Guitar',
        email: 'mick@motleycrue.com',
        phone: '15550202',
        file: 'mick-mars.jpg',
        artist_id: motleyCrue.id
      }
    ]);

    // 6. Create Crew Members for Artists
    await Crew.bulkCreate([
      {
        name: 'John Doe',
        role: 'Sound Engineer',
        email: 'john@kisstechnical.com',
        phone: '15551001',
        file: 'john-doe.jpg',
        artist_id: kiss.id
      },
      {
        name: 'Jane Smith',
        role: 'Light Technician',
        email: 'jane@kisstechnical.com',
        phone: '15551002',
        file: 'jane-smith.jpg',
        artist_id: kiss.id
      },
      {
        name: 'Mike Johnson',
        role: 'Stage Manager',
        email: 'mike@motleycruetechnical.com',
        phone: '15552001',
        file: 'mike-johnson.jpg',
        artist_id: motleyCrue.id
      }
    ]);

    // 7. Create Events (with venue_id)
    const events = await Event.bulkCreate([
      {
        title: 'Kiss Farewell Tour',
        category: 'Rock',
        start_time: '2024-12-25T19:00:00',
        end_time: '2024-12-25T23:00:00',
        venue_id: locations[0].id,
        color: '#FF5733'
      },
      {
        title: 'Motley Crüe Reunion',
        category: 'Rock',
        start_time: '2024-12-31T20:00:00',
        end_time: '2025-01-01T01:00:00',
        venue_id: locations[1].id,
        color: '#C70039'
      },
      {
        title: 'Rock Legends Night',
        category: 'Rock',
        start_time: '2025-01-15T20:00:00',
        end_time: '2025-01-15T23:30:00',
        venue_id: locations[2].id,
        color: '#900C3F'
      }
    ], { returning: true });

    // 8. Create Event-Artist Relationships
    await events[0].setArtists([kiss]); 
    await events[1].setArtists([motleyCrue]); 
    await events[2].setArtists([kiss, motleyCrue, twistedSister]); 

    // 9. Create Artist-Venue Relationships (preferred venues for artists)
    // Using the through table directly since we have a many-to-many relationship
    await sequelize.models.ArtistVenues.bulkCreate([
      {
        artist_id: kiss.id,
        venue_id: locations[0].id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        artist_id: kiss.id,
        venue_id: locations[2].id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        artist_id: motleyCrue.id,
        venue_id: locations[1].id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        artist_id: motleyCrue.id,
        venue_id: locations[2].id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        artist_id: twistedSister.id,
        venue_id: locations[2].id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        artist_id: twistedSister.id,
        venue_id: locations[3].id,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    console.log('Initial data setup completed successfully.');
  } catch (error) {
    console.error('Error inserting initial data:', error);
    throw error;
  }
};

export { insertInitialData };
