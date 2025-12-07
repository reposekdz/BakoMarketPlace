import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.query(`USE ${process.env.DB_NAME}`);
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        role ENUM('user', 'vendor', 'admin') DEFAULT 'user',
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone VARCHAR(20),
        address TEXT,
        city VARCHAR(100),
        country VARCHAR(100),
        is_seller BOOLEAN DEFAULT FALSE,
        is_verified BOOLEAN DEFAULT FALSE,
        avatar VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS shops (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        shop_name VARCHAR(255) NOT NULL,
        shop_category VARCHAR(100),
        business_type VARCHAR(100),
        tax_id VARCHAR(100),
        description TEXT,
        logo VARCHAR(255),
        banner VARCHAR(255),
        rating DECIMAL(3,2) DEFAULT 0,
        total_sales INT DEFAULT 0,
        followers INT DEFAULT 0,
        verified BOOLEAN DEFAULT FALSE,
        country VARCHAR(100),
        province VARCHAR(100),
        district VARCHAR(100),
        sector VARCHAR(100),
        cell VARCHAR(100),
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        offers_delivery BOOLEAN DEFAULT TRUE,
        delivery_radius INT DEFAULT 10,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user (user_id),
        INDEX idx_location (latitude, longitude),
        INDEX idx_province (province),
        INDEX idx_district (district)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        parent_id INT,
        image VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
        INDEX idx_slug (slug),
        INDEX idx_parent (parent_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        buyer_id INT NOT NULL,
        seller_id INT NOT NULL,
        product_id INT,
        last_message TEXT,
        last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        unread_buyer INT DEFAULT 0,
        unread_seller INT DEFAULT 0,
        status ENUM('active', 'archived', 'blocked') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
        INDEX idx_buyer (buyer_id),
        INDEX idx_seller (seller_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS conversation_messages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        conversation_id INT NOT NULL,
        sender_id INT NOT NULL,
        message TEXT NOT NULL,
        attachment_url VARCHAR(255),
        attachment_type VARCHAR(50),
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
        FOREIGN KEY (sender_id) REFERENCES users(id),
        INDEX idx_conversation (conversation_id),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        shop_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        original_price DECIMAL(10,2),
        category VARCHAR(100),
        brand VARCHAR(100),
        sku VARCHAR(100),
        stock INT DEFAULT 0,
        rating DECIMAL(3,2) DEFAULT 0,
        reviews_count INT DEFAULT 0,
        views INT DEFAULT 0,
        sales INT DEFAULT 0,
        featured BOOLEAN DEFAULT FALSE,
        status ENUM('active', 'draft', 'out_of_stock') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
        INDEX idx_category (category),
        INDEX idx_shop (shop_id),
        FULLTEXT idx_search (name, description)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        is_primary BOOLEAN DEFAULT FALSE,
        display_order INT DEFAULT 0,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_product (product_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_variations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        type VARCHAR(50),
        value VARCHAR(100),
        price_modifier DECIMAL(10,2) DEFAULT 0,
        stock INT DEFAULT 0,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_product_var (product_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        shop_id INT NOT NULL,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
        payment_method VARCHAR(50),
        shipping_address TEXT,
        tracking_number VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (shop_id) REFERENCES shops(id),
        INDEX idx_user (user_id),
        INDEX idx_shop (shop_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        variation_details JSON,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id),
        INDEX idx_order (order_id),
        INDEX idx_product_item (product_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        user_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        verified_purchase BOOLEAN DEFAULT FALSE,
        helpful_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id),
        INDEX idx_product (product_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS review_images (
        id INT PRIMARY KEY AUTO_INCREMENT,
        review_id INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
        INDEX idx_review (review_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        product_id INT,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        attachment_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id),
        FOREIGN KEY (receiver_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(id),
        INDEX idx_conversation (sender_id, receiver_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_wishlist (user_id, product_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS cart (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT DEFAULT 1,
        variation_details JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_user_cart (user_id),
        INDEX idx_product_cart (product_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS expos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        start_date DATETIME NOT NULL,
        end_date DATETIME NOT NULL,
        status ENUM('upcoming', 'live', 'ended') DEFAULT 'upcoming',
        attendees_count INT DEFAULT 0,
        booths_count INT DEFAULT 0,
        banner_image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_status_expo (status),
        INDEX idx_dates (start_date, end_date)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS expo_booths (
        id INT PRIMARY KEY AUTO_INCREMENT,
        expo_id INT NOT NULL,
        shop_id INT NOT NULL,
        booth_number VARCHAR(50),
        is_live BOOLEAN DEFAULT FALSE,
        viewers_count INT DEFAULT 0,
        FOREIGN KEY (expo_id) REFERENCES expos(id) ON DELETE CASCADE,
        FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
        INDEX idx_expo (expo_id),
        INDEX idx_shop_booth (shop_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS analytics (
        id INT PRIMARY KEY AUTO_INCREMENT,
        shop_id INT NOT NULL,
        date DATE NOT NULL,
        views INT DEFAULT 0,
        clicks INT DEFAULT 0,
        sales INT DEFAULT 0,
        revenue DECIMAL(10,2) DEFAULT 0,
        FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
        UNIQUE KEY unique_analytics (shop_id, date)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS translations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        translation_key VARCHAR(255) NOT NULL,
        language VARCHAR(10) NOT NULL,
        value TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_translation (translation_key, language),
        INDEX idx_key (translation_key),
        INDEX idx_language (language)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id INT,
        details JSON,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_user_log (user_id),
        INDEX idx_entity (entity_type, entity_id),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('order', 'message', 'review', 'system') DEFAULT 'system',
        is_read BOOLEAN DEFAULT FALSE,
        link VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_notif (user_id),
        INDEX idx_read (is_read)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS coupons (
        id INT PRIMARY KEY AUTO_INCREMENT,
        code VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        discount_type ENUM('percentage', 'fixed') NOT NULL,
        discount_value DECIMAL(10,2) NOT NULL,
        min_order_amount DECIMAL(10,2) DEFAULT 0,
        max_uses INT,
        used_count INT DEFAULT 0,
        start_date DATETIME NOT NULL,
        end_date DATETIME NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_code (code),
        INDEX idx_active (is_active)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS shop_followers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        shop_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
        UNIQUE KEY unique_follow (user_id, shop_id),
        INDEX idx_user_follow (user_id),
        INDEX idx_shop_follow (shop_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS video_calls (
        id INT PRIMARY KEY AUTO_INCREMENT,
        caller_id INT NOT NULL,
        receiver_id INT NOT NULL,
        conversation_id INT,
        call_type ENUM('audio', 'video') NOT NULL,
        status ENUM('initiated', 'ringing', 'active', 'ended', 'missed', 'rejected') DEFAULT 'initiated',
        duration INT DEFAULT 0,
        started_at TIMESTAMP NULL,
        ended_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (caller_id) REFERENCES users(id),
        FOREIGN KEY (receiver_id) REFERENCES users(id),
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE SET NULL,
        INDEX idx_caller (caller_id),
        INDEX idx_receiver (receiver_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        session_token VARCHAR(255) NOT NULL,
        device_info JSON,
        ip_address VARCHAR(45),
        is_online BOOLEAN DEFAULT TRUE,
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_session (user_id),
        INDEX idx_token (session_token),
        INDEX idx_online (is_online)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_views (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        user_id INT,
        session_id VARCHAR(255),
        ip_address VARCHAR(45),
        user_agent TEXT,
        referrer VARCHAR(255),
        duration INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_product_view (product_id),
        INDEX idx_user_view (user_id),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS shop_analytics (
        id INT PRIMARY KEY AUTO_INCREMENT,
        shop_id INT NOT NULL,
        date DATE NOT NULL,
        views INT DEFAULT 0,
        unique_visitors INT DEFAULT 0,
        product_views INT DEFAULT 0,
        messages_received INT DEFAULT 0,
        orders INT DEFAULT 0,
        revenue DECIMAL(10,2) DEFAULT 0,
        new_followers INT DEFAULT 0,
        conversion_rate DECIMAL(5,2) DEFAULT 0,
        avg_order_value DECIMAL(10,2) DEFAULT 0,
        FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
        UNIQUE KEY unique_shop_date (shop_id, date),
        INDEX idx_date (date)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_recommendations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        score DECIMAL(5,2) NOT NULL,
        reason VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_user_rec (user_id),
        INDEX idx_score (score)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS price_alerts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        target_price DECIMAL(10,2) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        notified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_user_alert (user_id),
        INDEX idx_active (is_active)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS advertisements (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(255) NOT NULL,
        video_url VARCHAR(255),
        link_url VARCHAR(255),
        ad_type ENUM('banner', 'popup', 'video', 'carousel', 'native', 'interstitial') NOT NULL,
        placement ENUM('home_top', 'home_sidebar', 'product_page', 'checkout', 'category', 'search_results') NOT NULL,
        sponsor_id INT,
        sponsor_name VARCHAR(255),
        sponsor_logo VARCHAR(255),
        start_date DATETIME NOT NULL,
        end_date DATETIME NOT NULL,
        budget DECIMAL(10,2) DEFAULT 0,
        spent DECIMAL(10,2) DEFAULT 0,
        impressions INT DEFAULT 0,
        clicks INT DEFAULT 0,
        conversions INT DEFAULT 0,
        ctr DECIMAL(5,2) DEFAULT 0,
        status ENUM('active', 'paused', 'completed', 'pending') DEFAULT 'pending',
        priority INT DEFAULT 0,
        target_audience JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sponsor_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_status (status),
        INDEX idx_placement (placement),
        INDEX idx_dates (start_date, end_date),
        INDEX idx_priority (priority)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS ad_interactions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        ad_id INT NOT NULL,
        user_id INT,
        interaction_type ENUM('impression', 'click', 'conversion', 'close') NOT NULL,
        device_type VARCHAR(50),
        browser VARCHAR(50),
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ad_id) REFERENCES advertisements(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_ad (ad_id),
        INDEX idx_type (interaction_type),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS expo_events (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        start_date DATETIME NOT NULL,
        end_date DATETIME NOT NULL,
        status ENUM('upcoming', 'live', 'ended') DEFAULT 'upcoming',
        banner_image VARCHAR(255),
        video_url VARCHAR(255),
        location VARCHAR(255),
        is_virtual BOOLEAN DEFAULT TRUE,
        max_booths INT DEFAULT 100,
        booth_price DECIMAL(10,2) DEFAULT 0,
        attendees_count INT DEFAULT 0,
        total_revenue DECIMAL(10,2) DEFAULT 0,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_dates (start_date, end_date),
        INDEX idx_featured (featured)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS expo_booths (
        id INT PRIMARY KEY AUTO_INCREMENT,
        expo_id INT NOT NULL,
        shop_id INT NOT NULL,
        booth_number VARCHAR(50),
        booth_type ENUM('standard', 'premium', 'vip') DEFAULT 'standard',
        position_x INT DEFAULT 0,
        position_y INT DEFAULT 0,
        is_live BOOLEAN DEFAULT FALSE,
        viewers_count INT DEFAULT 0,
        total_views INT DEFAULT 0,
        products_displayed INT DEFAULT 0,
        sales_made INT DEFAULT 0,
        revenue DECIMAL(10,2) DEFAULT 0,
        booth_design JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (expo_id) REFERENCES expo_events(id) ON DELETE CASCADE,
        FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
        INDEX idx_expo (expo_id),
        INDEX idx_shop (shop_id),
        INDEX idx_live (is_live)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS expo_attendees (
        id INT PRIMARY KEY AUTO_INCREMENT,
        expo_id INT NOT NULL,
        user_id INT NOT NULL,
        registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        check_in_time TIMESTAMP NULL,
        booths_visited JSON,
        products_viewed JSON,
        time_spent INT DEFAULT 0,
        FOREIGN KEY (expo_id) REFERENCES expo_events(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_attendee (expo_id, user_id),
        INDEX idx_expo_att (expo_id),
        INDEX idx_user_att (user_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS stream_participants (
        id INT PRIMARY KEY AUTO_INCREMENT,
        stream_id INT NOT NULL,
        user_id INT NOT NULL,
        role ENUM('host', 'co-host', 'guest', 'viewer') DEFAULT 'viewer',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        left_at TIMESTAMP NULL,
        is_camera_on BOOLEAN DEFAULT FALSE,
        is_mic_on BOOLEAN DEFAULT FALSE,
        screen_sharing BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (stream_id) REFERENCES live_streams(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id),
        INDEX idx_stream_part (stream_id),
        INDEX idx_user_part (user_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS stream_chat (
        id INT PRIMARY KEY AUTO_INCREMENT,
        stream_id INT NOT NULL,
        user_id INT NOT NULL,
        message TEXT NOT NULL,
        message_type ENUM('text', 'emoji', 'gift', 'product', 'poll') DEFAULT 'text',
        metadata JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (stream_id) REFERENCES live_streams(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id),
        INDEX idx_stream_chat (stream_id),
        INDEX idx_created_chat (created_at)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS stream_reactions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        stream_id INT NOT NULL,
        user_id INT NOT NULL,
        reaction_type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (stream_id) REFERENCES live_streams(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id),
        INDEX idx_stream_react (stream_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS stream_products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        stream_id INT NOT NULL,
        product_id INT NOT NULL,
        display_order INT DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        special_price DECIMAL(10,2),
        quantity_available INT,
        quantity_sold INT DEFAULT 0,
        clicks INT DEFAULT 0,
        FOREIGN KEY (stream_id) REFERENCES live_streams(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id),
        INDEX idx_stream_prod (stream_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS ai_recommendations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        score DECIMAL(5,2) NOT NULL,
        reason TEXT,
        algorithm VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_user_ai (user_id),
        INDEX idx_score_ai (score)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS social_shopping (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        friend_id INT NOT NULL,
        activity_type ENUM('shared_cart', 'group_buy', 'wish_together', 'compare') NOT NULL,
        product_ids JSON,
        status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_social (user_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS voice_search (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        query_text TEXT NOT NULL,
        audio_url VARCHAR(255),
        results_count INT DEFAULT 0,
        selected_product_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (selected_product_id) REFERENCES products(id) ON DELETE SET NULL,
        INDEX idx_user_voice (user_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS virtual_try_room (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        session_id VARCHAR(255) NOT NULL,
        products_tried JSON,
        body_measurements JSON,
        preferences JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_vtr (user_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS smart_contracts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL,
        contract_address VARCHAR(255),
        blockchain VARCHAR(50),
        status ENUM('pending', 'executed', 'failed') DEFAULT 'pending',
        transaction_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        INDEX idx_order_contract (order_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS live_streams (
        id INT PRIMARY KEY AUTO_INCREMENT,
        shop_id INT NOT NULL,
        expo_booth_id INT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        stream_url VARCHAR(255),
        thumbnail VARCHAR(255),
        status ENUM('scheduled', 'live', 'ended') DEFAULT 'scheduled',
        scheduled_at DATETIME,
        started_at TIMESTAMP NULL,
        ended_at TIMESTAMP NULL,
        viewers_count INT DEFAULT 0,
        peak_viewers INT DEFAULT 0,
        total_views INT DEFAULT 0,
        likes INT DEFAULT 0,
        products_featured JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
        FOREIGN KEY (expo_booth_id) REFERENCES expo_booths(id) ON DELETE SET NULL,
        INDEX idx_shop_stream (shop_id),
        INDEX idx_status_stream (status)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS gamification (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        points INT DEFAULT 0,
        level INT DEFAULT 1,
        badges JSON,
        achievements JSON,
        streak_days INT DEFAULT 0,
        last_activity DATE,
        total_purchases INT DEFAULT 0,
        total_reviews INT DEFAULT 0,
        referrals INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_game (user_id),
        INDEX idx_points (points),
        INDEX idx_level (level)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS flash_sales (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        original_price DECIMAL(10,2) NOT NULL,
        sale_price DECIMAL(10,2) NOT NULL,
        discount_percentage DECIMAL(5,2),
        quantity_available INT NOT NULL,
        quantity_sold INT DEFAULT 0,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        status ENUM('upcoming', 'active', 'ended', 'sold_out') DEFAULT 'upcoming',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_product_flash (product_id),
        INDEX idx_status_flash (status),
        INDEX idx_times (start_time, end_time)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS ar_try_on (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        ar_model_url VARCHAR(255) NOT NULL,
        ar_type ENUM('face', 'body', 'room', 'hand') NOT NULL,
        model_size INT,
        usage_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_product_ar (product_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS shipping_rates (
        id INT PRIMARY KEY AUTO_INCREMENT,
        shop_id INT NOT NULL,
        country VARCHAR(100) NOT NULL,
        region VARCHAR(100),
        rate DECIMAL(10,2) NOT NULL,
        estimated_days VARCHAR(50),
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
        INDEX idx_shop_shipping (shop_id),
        INDEX idx_country (country)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS currencies (
        id INT PRIMARY KEY AUTO_INCREMENT,
        code VARCHAR(10) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        symbol VARCHAR(10) NOT NULL,
        exchange_rate DECIMAL(15,6) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_code (code)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS ui_translations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        key_name VARCHAR(255) NOT NULL,
        language_code VARCHAR(10) NOT NULL,
        translated_text TEXT NOT NULL,
        context VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_translation_key (key_name, language_code),
        INDEX idx_key (key_name),
        INDEX idx_lang (language_code)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_translations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        language_code VARCHAR(10) NOT NULL,
        name VARCHAR(255),
        description TEXT,
        features JSON,
        specifications JSON,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_product_lang (product_id, language_code),
        INDEX idx_product_trans (product_id),
        INDEX idx_lang_trans (language_code)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS category_translations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        category_id INT NOT NULL,
        language_code VARCHAR(10) NOT NULL,
        name VARCHAR(255),
        description TEXT,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
        UNIQUE KEY unique_category_lang (category_id, language_code),
        INDEX idx_category_trans (category_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS predictive_analytics (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        prediction_type ENUM('demand', 'churn', 'lifetime_value', 'next_purchase') NOT NULL,
        prediction_data JSON NOT NULL,
        confidence_score DECIMAL(5,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_pred (user_id),
        INDEX idx_type (prediction_type)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS dynamic_pricing (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        base_price DECIMAL(10,2) NOT NULL,
        current_price DECIMAL(10,2) NOT NULL,
        demand_factor DECIMAL(5,2) DEFAULT 1.0,
        competition_factor DECIMAL(5,2) DEFAULT 1.0,
        time_factor DECIMAL(5,2) DEFAULT 1.0,
        inventory_factor DECIMAL(5,2) DEFAULT 1.0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_product_price (product_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS subscription_boxes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        box_type VARCHAR(100) NOT NULL,
        frequency ENUM('weekly', 'biweekly', 'monthly', 'quarterly') NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        products JSON,
        preferences JSON,
        status ENUM('active', 'paused', 'cancelled') DEFAULT 'active',
        next_delivery DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_sub (user_id),
        INDEX idx_status_sub (status)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS influencer_campaigns (
        id INT PRIMARY KEY AUTO_INCREMENT,
        influencer_id INT NOT NULL,
        campaign_name VARCHAR(255) NOT NULL,
        products JSON,
        commission_rate DECIMAL(5,2) NOT NULL,
        unique_code VARCHAR(50) UNIQUE,
        clicks INT DEFAULT 0,
        conversions INT DEFAULT 0,
        revenue DECIMAL(10,2) DEFAULT 0,
        commission_earned DECIMAL(10,2) DEFAULT 0,
        start_date DATE,
        end_date DATE,
        status ENUM('active', 'paused', 'completed') DEFAULT 'active',
        FOREIGN KEY (influencer_id) REFERENCES users(id),
        INDEX idx_influencer (influencer_id),
        INDEX idx_code (unique_code)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS nft_products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        nft_contract VARCHAR(255),
        token_id VARCHAR(255),
        blockchain VARCHAR(50),
        metadata_uri VARCHAR(500),
        owner_address VARCHAR(255),
        mint_date TIMESTAMP,
        royalty_percentage DECIMAL(5,2),
        is_listed BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_product_nft (product_id),
        INDEX idx_owner (owner_address)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS metaverse_stores (
        id INT PRIMARY KEY AUTO_INCREMENT,
        shop_id INT NOT NULL,
        platform VARCHAR(100),
        store_url VARCHAR(500),
        coordinates_x DECIMAL(10,2),
        coordinates_y DECIMAL(10,2),
        coordinates_z DECIMAL(10,2),
        avatar_npc JSON,
        virtual_products JSON,
        visitors_count INT DEFAULT 0,
        sales_count INT DEFAULT 0,
        FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
        INDEX idx_shop_meta (shop_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS ai_chatbots (
        id INT PRIMARY KEY AUTO_INCREMENT,
        shop_id INT NOT NULL,
        bot_name VARCHAR(100),
        personality JSON,
        knowledge_base JSON,
        conversations_count INT DEFAULT 0,
        satisfaction_rate DECIMAL(5,2),
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
        INDEX idx_shop_bot (shop_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS chatbot_conversations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        bot_id INT NOT NULL,
        user_id INT,
        session_id VARCHAR(255),
        messages JSON,
        sentiment_score DECIMAL(5,2),
        resolved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bot_id) REFERENCES ai_chatbots(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_bot_conv (bot_id),
        INDEX idx_session (session_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS visual_search (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        image_url VARCHAR(500),
        detected_objects JSON,
        matched_products JSON,
        search_accuracy DECIMAL(5,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_user_visual (user_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS personalized_feeds (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        feed_type ENUM('home', 'discover', 'trending', 'recommended') NOT NULL,
        products JSON,
        algorithm_version VARCHAR(50),
        engagement_score DECIMAL(5,2),
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_feed (user_id),
        INDEX idx_type_feed (feed_type)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS loyalty_tiers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        tier_name VARCHAR(50),
        tier_level INT,
        points_required INT,
        benefits JSON,
        discount_percentage DECIMAL(5,2),
        free_shipping BOOLEAN DEFAULT FALSE,
        priority_support BOOLEAN DEFAULT FALSE,
        exclusive_access BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_tier (user_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS social_proof (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        proof_type ENUM('recent_purchase', 'trending', 'low_stock', 'popular', 'celebrity') NOT NULL,
        message TEXT,
        user_count INT,
        time_window VARCHAR(50),
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_product_proof (product_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS abandoned_carts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        cart_data JSON,
        total_value DECIMAL(10,2),
        recovery_email_sent BOOLEAN DEFAULT FALSE,
        recovery_discount DECIMAL(5,2),
        recovered BOOLEAN DEFAULT FALSE,
        abandoned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_abandoned (user_id),
        INDEX idx_recovered (recovered)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_bundles (
        id INT PRIMARY KEY AUTO_INCREMENT,
        bundle_name VARCHAR(255) NOT NULL,
        product_ids JSON NOT NULL,
        bundle_price DECIMAL(10,2) NOT NULL,
        original_total DECIMAL(10,2),
        discount_percentage DECIMAL(5,2),
        is_active BOOLEAN DEFAULT TRUE,
        sales_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_active_bundle (is_active)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS pre_orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        user_id INT NOT NULL,
        quantity INT NOT NULL,
        deposit_amount DECIMAL(10,2),
        total_amount DECIMAL(10,2),
        expected_delivery DATE,
        status ENUM('pending', 'confirmed', 'cancelled', 'fulfilled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        INDEX idx_product_preorder (product_id),
        INDEX idx_user_preorder (user_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS waitlists (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        user_id INT NOT NULL,
        notify_email VARCHAR(255),
        notify_sms VARCHAR(20),
        notified BOOLEAN DEFAULT FALSE,
        position INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_product_wait (product_id),
        INDEX idx_notified (notified)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS gift_cards (
        id INT PRIMARY KEY AUTO_INCREMENT,
        code VARCHAR(50) UNIQUE NOT NULL,
        initial_value DECIMAL(10,2) NOT NULL,
        current_value DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10),
        purchaser_id INT,
        recipient_email VARCHAR(255),
        message TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        expires_at DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (purchaser_id) REFERENCES users(id),
        INDEX idx_code_gift (code)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS referral_program (
        id INT PRIMARY KEY AUTO_INCREMENT,
        referrer_id INT NOT NULL,
        referee_id INT,
        referral_code VARCHAR(50) UNIQUE,
        status ENUM('pending', 'completed', 'rewarded') DEFAULT 'pending',
        reward_type ENUM('points', 'discount', 'cash') NOT NULL,
        reward_value DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (referrer_id) REFERENCES users(id),
        FOREIGN KEY (referee_id) REFERENCES users(id),
        INDEX idx_referrer (referrer_id),
        INDEX idx_code_ref (referral_code)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_auctions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        starting_bid DECIMAL(10,2) NOT NULL,
        current_bid DECIMAL(10,2),
        highest_bidder_id INT,
        bid_increment DECIMAL(10,2),
        reserve_price DECIMAL(10,2),
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        status ENUM('upcoming', 'active', 'ended', 'cancelled') DEFAULT 'upcoming',
        total_bids INT DEFAULT 0,
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (highest_bidder_id) REFERENCES users(id),
        INDEX idx_product_auction (product_id),
        INDEX idx_status_auction (status)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS auction_bids (
        id INT PRIMARY KEY AUTO_INCREMENT,
        auction_id INT NOT NULL,
        user_id INT NOT NULL,
        bid_amount DECIMAL(10,2) NOT NULL,
        is_auto_bid BOOLEAN DEFAULT FALSE,
        max_auto_bid DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (auction_id) REFERENCES product_auctions(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id),
        INDEX idx_auction_bid (auction_id),
        INDEX idx_user_bid (user_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS sustainability_scores (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        carbon_footprint DECIMAL(10,2),
        recyclable BOOLEAN DEFAULT FALSE,
        eco_friendly BOOLEAN DEFAULT FALSE,
        ethical_sourcing BOOLEAN DEFAULT FALSE,
        certifications JSON,
        overall_score DECIMAL(5,2),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_product_sustain (product_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS virtual_assistants (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        assistant_name VARCHAR(100),
        preferences JSON,
        shopping_history JSON,
        budget_limits JSON,
        auto_reorder_enabled BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_assistant (user_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS smart_mirrors (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        session_id VARCHAR(255),
        body_scan_data JSON,
        outfit_combinations JSON,
        saved_looks JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        INDEX idx_user_mirror (user_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS drone_deliveries (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL,
        drone_id VARCHAR(100),
        flight_path JSON,
        estimated_arrival DATETIME,
        actual_arrival DATETIME,
        status ENUM('scheduled', 'in_flight', 'delivered', 'failed') DEFAULT 'scheduled',
        weather_conditions JSON,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        INDEX idx_order_drone (order_id),
        INDEX idx_status_drone (status)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS emotion_analytics (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        session_id VARCHAR(255),
        detected_emotions JSON,
        product_reactions JSON,
        engagement_level DECIMAL(5,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_user_emotion (user_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS collaborative_filtering (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        similar_users JSON,
        recommended_products JSON,
        similarity_score DECIMAL(5,2),
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_collab (user_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS inventory_predictions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        predicted_demand INT,
        confidence_level DECIMAL(5,2),
        reorder_point INT,
        optimal_stock INT,
        prediction_date DATE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_product_inventory (product_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS cross_border_shipping (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL,
        origin_country VARCHAR(100),
        destination_country VARCHAR(100),
        customs_value DECIMAL(10,2),
        duties_taxes DECIMAL(10,2),
        tracking_number VARCHAR(255),
        customs_status ENUM('pending', 'cleared', 'held', 'rejected') DEFAULT 'pending',
        FOREIGN KEY (order_id) REFERENCES orders(id),
        INDEX idx_order_cross (order_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        language_code VARCHAR(10) DEFAULT 'en',
        currency_code VARCHAR(10) DEFAULT 'USD',
        theme VARCHAR(20) DEFAULT 'light',
        notifications JSON,
        privacy_settings JSON,
        accessibility JSON,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_pref (user_id)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS expo_booth_applications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        expo_id INT NOT NULL,
        shop_id INT NOT NULL,
        booth_type ENUM('standard', 'premium', 'vip') DEFAULT 'standard',
        company_name VARCHAR(255),
        contact_email VARCHAR(255),
        contact_phone VARCHAR(20),
        description TEXT,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (expo_id) REFERENCES expo_events(id) ON DELETE CASCADE,
        FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
        INDEX idx_expo_app (expo_id),
        INDEX idx_status_app (status)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS expo_sponsors (
        id INT PRIMARY KEY AUTO_INCREMENT,
        expo_id INT NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        contact_name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(20),
        package_type ENUM('bronze', 'silver', 'gold', 'platinum') NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        logo_url VARCHAR(500),
        website VARCHAR(500),
        status ENUM('pending', 'active', 'expired') DEFAULT 'pending',
        benefits JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (expo_id) REFERENCES expo_events(id) ON DELETE CASCADE,
        INDEX idx_expo_sponsor (expo_id),
        INDEX idx_status_sponsor (status)
      ) ENGINE=InnoDB
    `);

    connection.release();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

export default pool;
