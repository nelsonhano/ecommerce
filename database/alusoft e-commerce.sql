CREATE TABLE IF NOT EXISTS `admins`(
    `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `surname` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `other_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `token` varchar(60) DEFAULT null, 
    `phone` VARCHAR(255) NULL,
    `password` VARCHAR(255) NOT NULL,
    `passport` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS `users`(
    `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `surname` VARCHAR(255) NOT NULL,
    `fisrt_name` VARCHAR(255) NOT NULL,
    `other_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `token` varchar(60) DEFAULT null,
    `otp` int(6) DEFAULT null,
    `phone` VARCHAR(255) NOT NULL,
    `address` text,
    `password` VARCHAR(255) NOT NULL,
    `passport` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS `categories`(
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `category_name` VARCHAR(255) NOT NULL,
    `description` text,
    `image` VARCHAR(255) NOT NULL,
    `created_at`TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS `products`(
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `categories_id` INT(11) UNSIGNED,
    FOREIGN KEY `fk_categories_products` (`categories_id`) REFERENCES categories(id) ON DELETE CASCADE,
    `price` INT(11) NOT NULL,
    `description` text,
    `image` VARCHAR(255) NOT NULL,
    `features` VARCHAR(200) NOT NULL,
    `unit_in_stock` int(50) unsigned NOT NULL,
    `created_at`TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS `orders`(
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT(11) UNSIGNED,
    FOREIGN KEY `fk_user_order` (`user_id`) REFERENCES users(id) ON DELETE CASCADE,
    `shipping` DECIMAL(10,2) NOT NULL,
    `discount` DECIMAL(10,2) NOT NULL,
    `order_id` varchar(50) null,
    `status` varchar(20) null,
    `total_quantity` int(11) UNSIGNED NOT NULL,
    `address` varchar(255) null,
    `total` DECIMAL(10,2) NOT NULL,
    `created_at`TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS `order_details`(
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `order_id` varchar(50) null,
    `product_id` INT(11) UNSIGNED,
    FOREIGN KEY `fk_product_id` (`product_id`) REFERENCES products(id) ON DELETE CASCADE,
   `quantity` smallint(2) NOT NULL,
    `total` DECIMAL(10,2) NOT NULL,
    `created_at`TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS `wishlists`(
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT(11) UNSIGNED,
    `product_id` INT(11) UNSIGNED,
    `created_at`TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
ALTER TABLE wishlists ADD FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
CREATE TABLE IF NOT EXISTS `messages`(
    `user_id` int(11) UNSIGNED,
    FOREIGN KEY `fk_user_address` (`user_id`) REFERENCES users(id) ON DELETE CASCADE,
    `fullName` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `content` VARCHAR(255) NOT NULL,
    `created_at`TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE `users` CHANGE `fisrt_name` `first_name` VARCHAR(255);
ALTER TABLE `users` ADD `gender` ENUM('Male', 'Female') NOT NULL AFTER `other_name`;
ALTER TABLE `admins` ADD `gender` ENUM('Male', 'Female') NOT NULL AFTER `other_name`;
ALTER TABLE `users` ADD `verified_at` DATETIME NULL DEFAULT NULL AFTER `updated_at`;
CREATE TABLE `subscribers`( `id` int(11) unsigned NOT null AUTO_INCREMENT PRIMARY KEY, `email` varchar(255) not null );
ALTER TABLE `subscribers` ADD `subscribed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `email`;
ALTER TABLE `admins` ADD UNIQUE(`email`);
ALTER TABLE `admins` ADD UNIQUE(`token`);
ALTER TABLE `admins` ADD UNIQUE(`phone`);
ALTER TABLE `users` ADD UNIQUE(`token`);
ALTER TABLE `users` ADD UNIQUE(`otp`);
ALTER TABLE `users` ADD UNIQUE(`email`);
ALTER TABLE `users` ADD UNIQUE(`phone`);
ALTER TABLE `categories` CHANGE `name` `category_name` VARCHAR(255);
ALTER TABLE `users` ADD `username` VARCHAR(255) NOT NULL AFTER `other_name`;
ALTER TABLE `orders` ADD `delivered_at` DATE NULL AFTER `created_at`;
ALTER TABLE `users` ADD `expired_at` TIME NULL DEFAULT NULL AFTER `verified_at`;