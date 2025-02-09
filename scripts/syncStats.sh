#!/bin/bash

# Sync the stats files from the server
# You need this for the homepage stats to work

wget https://regolith.rocks/stats/alltime.json -O public/stats/alltime.json
wget https://regolith.rocks/stats/last30.json -O public/stats/last30.json