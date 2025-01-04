import { User, Artist, Location, Event, VenueBooker, Musician, Crew } from './models/index.js';
import { sequelize } from './db.js';
import bcrypt from 'bcrypt';

const insertInitialData = async () => {
  try {
    // 1. Create Users
    const users = await User.bulkCreate([
      {
        username: 'admin',
        email: 'admin@epictours.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
      },
      {
        username: 'manager1',
        email: 'manager1@epictours.com',
        password: await bcrypt.hash('manager123', 10),
        role: 'manager',
      }
    ], { returning: true });

    // 2. Create Artists (with user_id)
    const kiss = await Artist.create({
        name: 'Kiss',
        email: 'kiss@example.com',
        contact: 'Gene Simmons',
        phone: '1234567890',
        webPage: 'https://kissonline.com',
        file: 'file-1733425970024.jpg',
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
        name: 'Blue Note NY',
        category: 'Jazz Club',
        address: '131 W 3rd St, New York, NY 10012, USA',
        latitude: 40.73068,
        longitude: -74.00049,
      },
      {
        name: 'Blue Note Tokyo',
        category: 'Jazz Club',
        address: '6-3-16 Minami-Aoyama, Minato City, Tokyo 107-0062, Japan',
        latitude: 35.66492,
        longitude: 139.72548,
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
        name: 'Blue Note NY Booker',
        email: 'info@bluenote.net',
        phone: '+1 212-475-8592'
      },
      {
        venue_id: locations[1].id,
        name: 'Blue Note Tokyo Booker',
        email: 'info@bluenote.jp',
        phone: '+81 3-5485-0088'
      },
      {
        venue_id: locations[2].id,
        name: 'Nova Jazz Cava Booker',
        email: 'info@novajazzcava.com',
        phone: '+34 937 893 590'
      }
    ]);

    // 5. Create Musicians for Artists
    await Musician.bulkCreate([
      {
        name: 'Paul Stanley',
        instrument: 'Guitar/Vocals',
        email: 'paul@kiss.com',
        phone: '+1 555-0101',
        file: 'paul-stanley.jpg',
        artist_id: kiss.id
      },
      {
        name: 'Gene Simmons',
        instrument: 'Bass/Vocals',
        email: 'gene@kiss.com',
        phone: '+1 555-0102',
        file: 'gene-simmons.jpg',
        artist_id: kiss.id
      },
      {
        name: 'Vince Neil',
        instrument: 'Vocals',
        email: 'vince@motleycrue.com',
        phone: '+1 555-0201',
        file: 'vince-neil.jpg',
        artist_id: motleyCrue.id
      },
      {
        name: 'Mick Mars',
        instrument: 'Guitar',
        email: 'mick@motleycrue.com',
        phone: '+1 555-0202',
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
        phone: '+1 555-1001',
        file: 'john-doe.jpg',
        artist_id: kiss.id
      },
      {
        name: 'Jane Smith',
        role: 'Light Technician',
        email: 'jane@kisstechnical.com',
        phone: '+1 555-1002',
        file: 'jane-smith.jpg',
        artist_id: kiss.id
      },
      {
        name: 'Mike Johnson',
        role: 'Stage Manager',
        email: 'mike@motleycruetechnical.com',
        phone: '+1 555-2001',
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
