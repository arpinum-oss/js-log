# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 7.0.0 - 2025-04-22

### BREAKING CHANGES

- `Level` renamed as `LogLevel`
- less internal parts exported

## 6.1.2 - 2024-11-22

### Changed

- Using custom code instead of library for type assertions
- Dependencies update

## 6.1.1 - 2024-07-23

### Added

- Not relying on `process.env` at all for some environments

## 6.0.0 - 2022-10-11

### BREAKING CHANGES

- `LOG_LEVEL` env var should be `ARP_LOG_LEVEL` to avoid conflicts
- `LOG_FILTER` env var should be `ARP_LOG_FILTER` to avoid conflicts

## 5.4.0 - 2022-08-26

### Added

- `CurrentLog` type is exported

## 5.3.4 - 2022-08-20

### Changed

- dependencies update

## 5.3.3 - 2022-01-07

### Changed

- dependencies update

## 5.3.2 - 2021-07-22

### Fixed

- Removing type dependency to node

### Changed

- Dependencies update

## 5.3.1 - 2020-05-24

### Added

- More examples

### Changed

- Dependencies update

## 5.3.0 - 2019-11-19

### Added

- Adding `getLogInputs` to format or order inputs given to console methods

## 5.2.0 - 2019-11-19

### Changed

- `logger.debug` logs to `console.debug` if available

## 5.1.0 - 2019-11-19

### Added

- Adding a `getDateString` option to return a custom date if ISO 8601 is not wanted

## 5.0.1 - 2019-04-19

### Changed

- Dependencies update

## 5.0.0 - 2018-07-04

### BREAKING CHANGES

- No more tcomb related stuff
