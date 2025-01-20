<p align="center"><img width=60% src="https://github.com/catchgit/hatch_booking/blob/main/media/catch.png"></p>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
![Python](https://img.shields.io/badge/python-v3.6+-blue.svg)
[![Build Status](https://api.travis-ci.com/catchgit/hatch_booking.svg?branch=main)](https://travis-ci.org/catchgit/hatch_booking)
![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg)
[![GitHub Issues](https://img.shields.io/github/issues/catchgit/hatch_booking.svg)](https://github.com/catchgit/hatch_booking/issues)
![Contributions welcome](https://img.shields.io/badge/contributions-welcome-orange.svg)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Basic Overview

Booking solution for Hatch to manage clients and rooms with API integration to Microsoft 365. Using Google Firebase as Authentication and Database.

<br>

## Installing

```bash
npm install
```

## Information

The application uses i18n provider to manage texts and language. The different languages are located in public/locales/[language]/translation.json. To use the translations:
```bash
<p>{t('example_key')}<p>
```