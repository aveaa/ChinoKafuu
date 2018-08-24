-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Авг 24 2018 г., 07:53
-- Версия сервера: 5.7.23-0ubuntu0.16.04.1
-- Версия PHP: 7.0.30-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `kafuu`
--

-- --------------------------------------------------------

--
-- Структура таблицы `banlist`
--

CREATE TABLE `banlist` (
  `id` int(64) NOT NULL COMMENT 'BANID',
  `usrID` varchar(64) NOT NULL COMMENT 'ID ПОЛЬЗОВАТЕЛЯ',
  `guildID` varchar(64) NOT NULL COMMENT 'ID КАНАЛА',
  `usrName` varchar(32) NOT NULL COMMENT 'ИМЯ ПОЛЬЗОВАТЕЛЯ',
  `modID` varchar(64) NOT NULL COMMENT 'ID МОДЕРАТОРА',
  `modName` varchar(32) NOT NULL COMMENT 'ИМЯ МОДЕРАТОРА',
  `reason` varchar(32) NOT NULL,
  `days` int(32) NOT NULL,
  `unbanned` int(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Бан-лист Chino Kafuu';

-- --------------------------------------------------------

--
-- Структура таблицы `guilds`
--

CREATE TABLE `guilds` (
  `gID` int(64) NOT NULL,
  `id` varchar(64) NOT NULL,
  `name` varchar(32) NOT NULL,
  `logsChannel` varchar(64) NOT NULL DEFAULT '0',
  `obscenity_filter` int(1) NOT NULL DEFAULT '0',
  `welcomemessages` varchar(1) NOT NULL DEFAULT '0',
  `welcomemessage` varchar(255) NOT NULL DEFAULT '%user%, Добро пожаловать на сервер %servername%!'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `reports`
--

CREATE TABLE `reports` (
  `id` int(32) NOT NULL,
  `guildID` varchar(64) NOT NULL,
  `suspectID` varchar(64) NOT NULL,
  `usrID` varchar(64) NOT NULL,
  `reason` varchar(32) NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modAws` int(1) NOT NULL DEFAULT '0',
  `modReason` varchar(64) DEFAULT 'Ответ не указан'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `warns`
--

CREATE TABLE `warns` (
  `id` int(32) NOT NULL,
  `guildID` varchar(64) NOT NULL,
  `usrID` varchar(64) NOT NULL,
  `modID` varchar(64) NOT NULL,
  `reason` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `whitelist`
--

CREATE TABLE `whitelist` (
  `id` int(11) NOT NULL,
  `usrId` varchar(64) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `banlist`
--
ALTER TABLE `banlist`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `guilds`
--
ALTER TABLE `guilds`
  ADD PRIMARY KEY (`gID`);

--
-- Индексы таблицы `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `warns`
--
ALTER TABLE `warns`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `whitelist`
--
ALTER TABLE `whitelist`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `banlist`
--
ALTER TABLE `banlist`
  MODIFY `id` int(64) NOT NULL AUTO_INCREMENT COMMENT 'BANID';
--
-- AUTO_INCREMENT для таблицы `guilds`
--
ALTER TABLE `guilds`
  MODIFY `gID` int(64) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(32) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `warns`
--
ALTER TABLE `warns`
  MODIFY `id` int(32) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `whitelist`
--
ALTER TABLE `whitelist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
