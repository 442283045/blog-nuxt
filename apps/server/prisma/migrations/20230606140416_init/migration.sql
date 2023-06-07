-- CreateTable
CREATE TABLE `articles` (
    `article_id` INTEGER NOT NULL AUTO_INCREMENT,
    `article_title` VARCHAR(255) NOT NULL,
    `article_author_user_id` INTEGER NOT NULL,
    `article_published_date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `article_thumbs_up_count` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `article_favorites_count` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `article_updated_date` DATETIME(0) NULL,
    `article_comments_count` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `article_view_count` INTEGER UNSIGNED NOT NULL DEFAULT 0,

    PRIMARY KEY (`article_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comments` (
    `comment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `comment_content` VARCHAR(255) NOT NULL,
    `comment_published_date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `comment_author_user_id` INTEGER UNSIGNED NOT NULL,
    `comment_article_id` INTEGER NOT NULL,

    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `avatar_path` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `last_login` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `user_bio` VARCHAR(255) NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favorite_articles` (
    `favorite_id` INTEGER NOT NULL AUTO_INCREMENT,
    `favorite_user_id` INTEGER NOT NULL,
    `favorite_article_id` INTEGER NOT NULL,
    `favorite_date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `id_UNIQUE`(`favorite_id`),
    INDEX `user_Id_UNIQUE`(`favorite_user_id`),
    INDEX `fk_favorite_article_idx`(`favorite_article_id`),
    PRIMARY KEY (`favorite_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `favorite_articles` ADD CONSTRAINT `fk_favorite_article` FOREIGN KEY (`favorite_article_id`) REFERENCES `articles`(`article_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
