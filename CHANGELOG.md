# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

This project uses [NerdBank.GitVersioning](https://github.com/AArnott/Nerdbank.GitVersioning)
to manage version numbers. This tool automatically sets the Semantic Versioning Patch
value based on the [Git height](https://github.com/AArnott/Nerdbank.GitVersioning#what-is-git-height)
of the commit that generated the build. As such, released versions of this extension
will not have contiguous patch numbers. Initial major and minor releases will be documented
in this file without a patch number. Patch version will be included for bug fix releases, but
may not exactly match a publicly released version.

## Unreleased

### Fixed

- Fixed an issue where the design canvas was sometimes not updated when the formula being 
  constructed is currently invalid.

### Updated 

- Changed activity bar icon to NEO-themed logo

## [1.0.8] - 2020-09-11

### Fixed

- Updated GRPC for Electron v9.2.1, matching the version shipping in VS Code (and VS Code Insiders) v1.49.

## [1.0] - 2020-08-26

### Added

- Support for editing property sets

## [0.6] - 2020-08-18

### Added

- Ability to view all types of token artifacts (token bases, behaviors, behavior groups and property sets)
- Support for creating new behaviors, behavior groups and property sets (populated with default values)
- Support for editing behaviors and behavior groups
- Preliminary support for editing token bases and property sets

### Changed

- Updated schema based on TTF changes (adds representationType for property sets)
- Updated TTF snapshot that is used in sandbox mode to incorporate latest TTF changes

## [0.5.17] - 2020-07-20

### Added

- Support for setting Token Definition properties.

### Changed

- Changed activity bar icon to IWA logo

## [0.5] - 2020-07-08

- Initial release
