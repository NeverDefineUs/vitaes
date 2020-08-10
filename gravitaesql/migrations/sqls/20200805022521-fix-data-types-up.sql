LOCK TABLES 
    `Alert` WRITE,
    `BugReport` WRITE,
    `Gatekeeper` WRITE,
    `Institution` WRITE,
    `Location` WRITE,
    `PersonalInfo` WRITE,
    `RecordAcademic` WRITE,
    `RecordAchievement` WRITE,
    `RecordEducation` WRITE,
    `RecordLanguage` WRITE,
    `RecordProject` WRITE,
    `RecordSet` WRITE,
    `RecordSkill` WRITE,
    `RecordWork` WRITE,
    `Template` WRITE,
    `TemplateParam` WRITE,
    `User` WRITE,
    `_GatekeeperToUser` WRITE,
    `_RecordAcademicToRecordSet` WRITE,
    `_RecordAchievementToRecordSet` WRITE,
    `_RecordEducationToRecordSet` WRITE,
    `_RecordLanguageToRecordSet` WRITE,
    `_RecordProjectToRecordSet` WRITE,
    `_RecordSetToRecordSkill` WRITE,
    `_RecordSetToRecordWork` WRITE;

SET FOREIGN_KEY_CHECKS = 0;

ALTER TABLE `Alert`
    CHANGE `authorVid` `authorVid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `message` `message` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `vid` `vid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `BugReport`
    CHANGE `authorVid` `authorVid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `data` `data` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `description` `description` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `email` `email` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `title` `title` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `vid` `vid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `Gatekeeper`
    CHANGE `description` `description` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `name` `name` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `vid` `vid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `Institution`
    CHANGE `abbreviaton` `abbreviaton` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `name` `name` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `vid` `vid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `Location`
    CHANGE `cityTown` `cityTown` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `country` `country` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `governingDistrict` `governingDistrict` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `vid` `vid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `PersonalInfo`
    CHANGE `address` `address` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `email` `email` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `github` `github` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `homepage` `homepage` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `linkedin` `linkedin` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `name` `name` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `phone` `phone` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `vid` `vid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `RecordAcademic`
    CHANGE `articleLink` `articleLink` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `description` `description` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `institutionVid` `institutionVid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `locationVid` `locationVid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `title` `title` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `vid` `vid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `RecordAchievement`
    CHANGE `certificateLink` `certificateLink` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `description` `description` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `institutionVid` `institutionVid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `locationVid` `locationVid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `position` `position` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `title` `title` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `vid` `vid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `RecordEducation`
    CHANGE `course` `course` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `description` `description` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `institutionVid` `institutionVid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `locationVid` `locationVid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `teacher` `teacher` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `vid` `vid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `RecordLanguage`
    CHANGE `level` `level` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `name` `name` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `vid` `vid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `RecordProject`
    CHANGE `description` `description` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `locationVid` `locationVid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `programmingLanguage` `programmingLanguage` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `repositoryLink` `repositoryLink` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `title` `title` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `vid` `vid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `RecordSet`
    CHANGE `ownerVid` `ownerVid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `personalInfoVid` `personalInfoVid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `sectionOrder` `sectionOrder` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `title` `title` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `vid` `vid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `RecordSkill`
    CHANGE `level` `level` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `name` `name` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `type` `type` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `vid` `vid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `RecordWork`
    CHANGE `description` `description` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `institutionVid` `institutionVid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `locationVid` `locationVid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
    CHANGE `role` `role` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `vid` `vid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `Template`
    CHANGE `baseFolder` `baseFolder` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `command` `command` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `vid` `vid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `TemplateParam`
    CHANGE `defaultValue` `defaultValue` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `displayName` `displayName` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `name` `name` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `templateVid` `templateVid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `values` `values` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `vid` `vid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `User`
    CHANGE `firebaseId` `firebaseId` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `vid` `vid` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `_GatekeeperToUser`
    CHANGE `A` `A` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `B` `B` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `_RecordAcademicToRecordSet`
    CHANGE `A` `A` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `B` `B` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `_RecordAchievementToRecordSet`
    CHANGE `A` `A` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `B` `B` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `_RecordEducationToRecordSet`
    CHANGE `A` `A` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `B` `B` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `_RecordLanguageToRecordSet`
    CHANGE `A` `A` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `B` `B` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `_RecordProjectToRecordSet`
    CHANGE `A` `A` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `B` `B` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `_RecordSetToRecordSkill`
    CHANGE `A` `A` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `B` `B` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `_RecordSetToRecordWork`
    CHANGE `A` `A` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CHANGE `B` `B` CHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

SET FOREIGN_KEY_CHECKS = 1;

UNLOCK TABLES;
