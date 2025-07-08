### July 8, 2025
## 1.4.1 - Maintenance release

This is a small release with a few important bug fixes.

- FIXED: Survey Calculator script has been rebuilt to use nearly a quarter of the RAM it was using before. Furthermore the RAM usage should remain stable even with large numbers of scans. 
- FIXED: Summary tab was not reimbursing claimants under certain circumstances.
- FIXED: Chart tooltips are now showing again
- FIXED: Work orders on the Dashboard tab can now be closed even when the page is loading.
- FIXED: Overcharge rate now showing the correct color for its statistics.
- FIXED: Ice found in Stanton now shows up as an error.

### June 13, 2025
## 1.4.0 - UI Framework Upgrade and Google Analytics

There's still work to do for the 4.2 update and **this is not that**. Before we get to the good stuff we needed a major update to the UI framework and the underlying version of the code engine. While it (hopefully) shouldn't look too different under the hood it's a massive upgrade! Big thanks to the testers for helping me find bugs.

One of the big additions is adding Google Analytics. This project has grown to the point where we need to know how much traffic we're getting so we can provision resources and plan for the future. Participation is totally optional. 

- NEW: Ore summary on the session summary screen.
- REMOVED: Bug reporting feature. Bug reports were not being received properly so we're going to rely on discord for all bug reports going forward.
- FIXED: Returned the "Fail Work order" functionlity.

### May 17, 2025
## 1.3.10 - Patches, Fixes and new locations

This is just a small incremental patch to fix some bugs and a 86 new mining locations for Star Citizen 4.1.1

- FIXED: Added a warning for missing discord guild names
- FIXED: a problem with the statistics calculator
- FIXED: The system chooser now renders with more depth
- FIXED: Deselect system is now working properly
- FIXED: a problem with the refinery selection
- FIXED: an issue with the OCR where exisiting clusters won't show the latest rock after a scan

### May 3, 2025
## 1.3.9 - Work Order Form Overhail and 4.1.1 Support

**Work Orders**

In order to support 4.1.1 the work order calculator has had a significant renovation.

- Expenses can now have "claimants" to support the new multi-crew features in 4.1.1. This means every expense can be reimbursed to a different user as long as they are listed in the crew-shares of that work order. Example: the person who repairs the ship is not the person who refines the ore who is not the person who sells it.  
- Removed the left panel. It was wasted space and the controls on it look better when they're integrated into the rest of the form.
- Reworked the UEX best price area to be tighter and more friendly.
- The "Default Activity Type" setting behaviour has been changed so changes the default activity type for the buttons on the session page and then you can additionally choose to lock it down as well to prevent work orders and scouting finds with a different type from being created.

**Bug Fixes**

- Completion date for refined jobs was wronglyu showing the work order creation date instead of the completion date.
- Vehicle orders SCU sums were 10x too big on the work order table.
- Survey Corps Tables: On the ROC/FPS table the "Clusters Scanned" value was showing the wrong number. 


### May 2
## 1.3.8 Bug fixing

This is just a small patch to address some bugs.

- Discord guild (orgs) membership was not refreshing and getting stuck. THis has hopefully been fixed and will now poll more often.
- There was a serious bug which can cause an infinite loading loop on the Dashboard.
- Workorders on the workorder tab were sometimes not loading properly.


### April 12, 2025
## 1.3.7 The bonus situation...

### Features:

- Bonuses are now a little more nuanced. 
    - Areas with insufficient data get a multiplier of 2.0 and after that the 
    - Areas with enough data get bonuses between 1.0 and 2.0 depending on the amount of data in the gravity well it sits in. (planetary body, gravity well, etc.)
- Leaderboard now shows your Survey Corps score, even if you didn't make the top 100 leaderboard.
- The scan bonus is now in the tooltip and in the popup on the scouting find entry form and should update correctly.

### Bug Fixes:

- Fixed: OCR not picking up resistances of 0.
- Fixed: OCR Numerical precision error.
- Fixed: Some gadgets not reporting instability correctly.
- Fixed: User scores not being written to user profiles correctly.
- Fixed: A few little UI bugs.

### March 27, 2025
## 1.3.6 4.1 Support

4.1 brings us new minerals, new mining ships and a new Regolith Survey Epoch.

### March 3, 2025
## 1.3.5 Signal Calculator

We've introduced scanning signal calculations in two places in the app. This should really help for the "Supply or Die" missions with everyone trying to find tin and ice inside I-type asteroids.

1. In the session look for the new button on the Scouting title bar. This gives you a modal popup to enter your scanning signals.
2. On the [Survey Corps Rock Type table](https://regolith.rocks/survey/rock_class). Look for the signal filter and enter your signal strength there to see which tock types match your signal

### Bug fixes:

- **FIXED**: The first gadget in the list didn't affect the loadout calculation

### February 19, 2025
## 1.3.3 - Org. Allegiances!

Now you can choose a Discord org allegiance in the  :SurveyCorps:[Survey Corps](https://regolith.rocks/profile/survey). Your scores are still individually calculated but the org you've chosen will display next to your name on the leaderboard. A second leaderboard has been added to collect the scores for each org .

Also the Org lock on sessions has now been re-enabled. You should once again be able to lock your sessions to only members of a given Discord org/guild.

### February 15, 2025
## 1.3.2 - Google Auth Fix!

This is a major rework of the authentication system that aims to fix some of the issues people were having, especially with Google Auth.

- Google Auth should now refresh properly so you don't have to refresh it every hour
- "Report Bug" Menu item added. Now you can report a bug directly from the app and it gets combined with a bunch of sexy context data, stack traces etc. to help us figure out what's going on.
- Error reporting stack added. Hopefully this will let us track the issues people are having even if they aren't reported.

### February 11, 2025
## 1.3.1 - Mining Loadout Calculator Updates for 4.0.1

This is a small but vital update to the [loadout calculator](https://regolith.rocks/loadouts/calculator) and related tables. The mining loadout calculator has been broken for a while and the values were all from 3.23 so it was high time for an update. 

- All module and laser stats have now been hooked up to **fetch from UEX API**. This should reduce the burden on regolith developers to maintain spreadsheets of stats and update them. It also puts the power to correct the tables in the user's hands through UEX's excellent data submission system.
- **Module bonuses now stack** according to the latest PU behaviour in 4.0.1 (until they change it again and I have to **rewrite** it).
- [Laser](https://regolith.rocks/loadouts/lasers) and [module](https://regolith.rocks/loadouts/modules) tables have been updated with the new table hotness. 
- New **fullscreen mode** for the laser tables.

If you see a number that looks wrong you can now submit a change to UEX (become a [data runner](https://uexcorp.space/data/home) today!) and Regolith will eventually consome that change.

Many thanks to the Regolith data runners (lookin at you **Pomi,lightVen0m and Wellmeg7BR**) who tirelessly corrected so many of the values before this launch!

### February 7, 2025
## 1.2.4 - Lasers and Loadouts Rework

All lasers, modules, gadgets etc. now have their attributes and prices synced from the UEX API. This should help keep things fresher between patches and make it easier for users to submit data changes when things don't look right.

From now on if you see a number or price in the loadout tables that doesn't look right you can submit a data change request to UEX and Regolith will pick it up shortly after it's approved.

- Table rework to include pyro and some new filter controls
- Performance improvements to Loadout tables
- New full screen mode for the Loadouts page.

### February 2, 2025
## 1.2.2 - Shut up, MATH! -- Ore SCU and price fixes

This is a small but very important update and reflects a few problems Regolith has had for a while. 

One of those problem: When you collect refined ore the game always rounds up to fill a box but Regolith didn't reflect that so the prices and SCU values shown were always reflective of the exact amount of ore refined instead of the number of boxes you take to market.

This change doesn't affect the database in any way, it just makes better choices about how to render the result in the client and when to round up. Hopefully this will be clearer going forward. Also note that we don't do this for salvage or vehicle ores because vehicle ores sell by the gem and salvage is already in boxes when it comes out.

This fix changes a LOT of numbers in the app so I've tried to be as careful as possible. If you see any discrepancies let me know.

- **FIXED**: Instability and resistance values now allow "0" as a valid value. Scouting scores have been updated to reflect this.
- **FIXED**: Final sell price was sometimes defaulting to 0.
- **FIXED**: Prices and store lookups are no longer affected by the system filter.  This was causing a lot of complications. The system filter now just affects refinery and gravity well dropdowns.

#### New Features:

- Session user tab can now be hidden since it's superfluous for sessions with only one user.
- Added a scouting summary to the summary tab so you can see who your scouts are ranked by they're score, discovered clusters etc.


**You should notice:**

- Fixed a bug where the store planet and system were not showing
- SCU values in the work order table are now "Yield" and not "Collected" because that number is more important for people hauling ore to market anyway.
- Yield SCU numbers for ship orders are always rounded up to the nearest SCU FOR EACH ORE TYPE.

### January 27, 2025
## 1.2.0 - Introducing the Regolith Survey Corps.

Introducing the **Regolith Survey Corps!** This is a new opt-in feature that will allow you to share your scouting finds with the community. This is a great way to help other miners find the best rocks and to get a little recognition for your hard work (if you want it).

The survey corps also creates an incentive to scan rocks even if you don't mine them and gives users a reason to get away hunting the most valuable rocks and find joy in the exploration and survey.

Hopefully this will be like a lightweight exploration mechanic while we wait for a better one from CIG!

### Bug Fixes:

- Fixed an issue where people who had set "Lock to discord guild" as their default were unable to unset this setting.
- Upgraded all legacy gravity well data to the new codes.
- Fixed an issue where OCR scans weren't getting their inert material values calculated correctly.

### December 22, 2024
## 1.1.5 - 4.0 Bug fixes

4.0 changes a lot so we're probably not done yet but here are a few (mostly OCR) bug fixes.

- BUG Fixed: OCR Capture didn't apply values if there was no Method or Refinery found in the capture.
- BUG Fixed: the refinery UI background dot grid sometimes made it look like yield numbers had a decimal.
- BUG Fixed: inconsistent station names for better refinery lookups 
- BUG Fixed: The workorder split total was sometimes different from the final sell price.
- Updated the scVersion to `4.0.0`.


### December 19, 2024
## 1.1.4 - The Organizer's Patch

This is a stepping stone to Star Citizen 4.0

### Session Roles!

- Session roles and ship roles can now be set. 
- You can also add crew shares to a work order by role (i.e. security people get a split of 10% of the profits etc.)

### For Pyro:

- **New Refineries**: New refineries for Pyro including: Checkmate, Ruin, Orbituary and Stanton Gateway.
- **New Materials:** Ice, Stileron, Tin, Silicon and Riccite. NOTE: PRICE SYNCHIGN FOR THESE MATERIALS IS NOT YET AVAILABLE.
- **System Filter**: Optionally limit your refineries, markets and gravity wells to one system.

### Session Changes:

- Sessions now close after 48 hours instead of 12 hours
- Closed sessions can now be re-opened!
- Much better state synching means session changes appear much faster on all clients and take way less server resources.

### Other fixes:

- Percentage and share values can now have up to 2 decimal places.
- Many little bug fixes.
- **NOTE:** Temporarily disabled the "Users must be a member of a discord server to join this session." until a fix can be found. Hopefully this will be back soon.

### November 2, 2024
## 1.1.3 - Minor fixes

## Tweaks:

- Reworked a lot of the capture settings. Can now capture SETUP, PROCESSING and COMPLETE work orders as well as turret cargo manifests and scouted rocks (but only from the prospector. Capturing the scanning MFD is still not done).
- On scouting capture OCR the rock now pops up so you can edit it if you need to. 
- Removed the somewhat redundant confirmation dialog for capturing and overwriting work orders from a capture.
- Re-did a few of the background images as they were getting kind of dated.

### Bugs Fixed:

- Fixed a bug where alternate sellers were showing as paid but not contributing t the final paid user count.
- COMPLETED Work orders can now be scanned


### October 30, 2024
## 1.1.2 - The Magic Patch!

#### Holy 🐄 you guys, OCR is in!

Ever since I started Regolith I've wanted a better way to capture work orders and rocks scans. Typing all those numbers is tedious and there has to be a better way. Well, now there is!

Now you can capture your work orders and scan rocks in 3 new exciting ways:

1. **Screen Sharing**: Share your screen with Regolith and you can capture work orders and rock scans directly from the game.
2. `ALT + Print Screen` puts a screenshot in the clipboard then `CTRL+V` to paste it directly into your session.
3. **Screenshot Upload**: Load a screenshot of a rock scan or a refinery window and Regolith will read the data directly from the image.

#### Also a few new features that folks were asking for:

- **CSV Downloading** of sessions is back. It's a little jankey but it's there.
- You can now **add *any* team** to a work order's crew shares, not just your own. 
- Several sneaky little bugs that were causing issues with the new features have been squashed.
- The mobile experience has gotten very slightly better. Still a long way to go though.
- Increased the RAM available to certain backend processes. This should significantly reduce load times on the front end.


### September 20, 2024
## 1.1.0 - The Space Accountant Patch

### New Features:

- Personal Dashboard stats! Now you can see statistics from all your sessions in one place.
- Work Order and Crew Share tabs: Manage your work orders across all your sessions.
- New helper control for when sharing unrefined values.
- Added new control for estimating the RMC, CMAT and aUEC of salvage wrecks.

### Fixes and Maintenance:

- Chart libraries updated.
- Reduced the frequency of some UEX Synch calls to lighten our burden on that service. Prices will still synch hourly but ships, planets, companies etc. will synch daily.
- Many performance tweaks.


### July 5, 2024
## 1.0.52 - Bugs bugs bugs

This is a quick patch to fix two issues that came up:

1. When selecting "Alternate Seller" on a work order the summary tab was not showing all unpaid crew shares correctly
2. When choosing "Share unrefined value" on a work order with a store selected that doesn't allow unrefined ore to be purchased the gross value was being set to zero.

### June 17, 2024
## 1.0.51 - Style Cleanup and scrollbars

You asked for it! You got it! Scrollbars are back! I know, I know, you're welcome.

This patch introduces a few little fixes that had been building up as well inlcuding:

- Prospector with Mole bags is now a ship option you can choose.
- Scrollbars should be visible wherever appropriate (and hopefully nowhere else).
- The reference numbers table on the work order tool has been restored. 
- A duplicated root DIV was causing some layout issues. This has been removed so hopefully those of you that saw a huge scrollable space under the app shouldn't anymore.

### May 31, 2024
## 1.0.50 - UEX 2.0 API Price synching

Not much to notice here but I completely changed the front-end scaffolding framework I was using. This will cut build times, speed up development and it creates a much smaller javascript package size as a nice added bonus. This kind of regular refactoring is really important if you don't want to always have 8 hours of work before you can implement anything cool.

### Error Handling

- Before we were just seeing "Mutation Error" which is not useful for debugging. Now you can copy the error and send it to the developer.

### Bug Fixes

- Salvaging table now sorts correctly (CMAT and RMCO were reversed and had each other's prices)
- Bug where Substract Transfer Fee wasn't being set correctly
- Bug where expenses aren't being saved properly.
- Shatter damage was showing the wrong color (negative shatter damage is good).


### May 18, 2024
## 1.0.49 - UEX 2.0 API Price synching

The primary fix here is rewriting our price synching scripts to work with the new UEX 2.0 API. This was mostly straightforward but involved some ID type changes so database migration was inevitable. 

Also this was a good opportunity to do some minor refactors in preparation for some new features planned for some time in the future.

HOTFIX: Fixed an issue where users who require discord membership for their sessions were not able to unset it.
HOTFIX: Minor fix to homepage chart for daily view
HOTFIX: Minor fix to Refinery names on data tables

### April 12, 2024
## 1.0.48 - API Access and Discord Server Restriction

This one has been a long time coming but there were some very fundamental changes that had to be done on the back end before I could work on the fun stuff.

#### New Features

- **Discord Server Restriction**: You can now restrict your session to only users who are in your discord server.
- **API Token Access**: You can now get an API Key and make calls to the Regolith API. Why would you want to do this? For the data nerds and tool developers out there who want to get their hands dirty. Also a few convenience fields like `processEndTime` and `yield` on refined ores have been added.
- The **Market Price finder** tool now allows multiple rows of the same type and load calculation with mixed activity types (ship, vehicle and salvage)

#### Bug Fixes

- Loadouts: More than one active module can be turned on for each laser
- Work Orders: Looks like CIG has changeed back from `DD:HH:MM` to `HHH:MM` so the countdown input has been reflected to take that input (even though it's less friendly IMHO)
- Work Orders: Better handling of failed state.
- Work Orders: Summaries now correctly separate and report Gross Vs. Net earnings.
- Ore chooser widgets were sorted improperly.
- The Market price finder was taking too long for entries to be calculated.
- Fixed some edge case permissions issues. There are still more to get through though.
- Complete reworking of the back end SDK connections to improve efficiencey and future-proofing.


### Jan 20, 2024
## 1.0.47 - Small,critical fixes

This is a tiny update to fix some very small nagging bugs

- Rock mass limits have been updated to 200,000
- Work order and scouting find deletions are optimistic now so they should feel snappier.
- Added a note to the FAQ about Ad-blockers sometimes interferring with login.
- Several other bugs too esoteric or boring to mention.

### January 9, 2024
## 1.0.46 - A Patch for the refactor

This is just a quick patch to follow up on the last patch. 

- Fixed some asynchronous update issues where changes weren't showing up until page reload. I would bet there's still more of these I haven't found though.
- Loadout lists got a little love and now show the loadout modules in the list so you can see what it is at a glance.
- Fixed the text on the "Leave session" dialog. I've noticed folks leaving sessions because they think they have to when the session is done. I want to make it clear that leaving a session will delete it from your history and prevent you from seeing payment updates in case folks didn't intend that.
- Misc other hotfixes and stability adjustments.


### January 6, 2024
## 1.0.45 - Holiday Refactor

This is one of those big refactor patches where hopefully nobody notices anything different. Until this point the UEX prices have been hardcoded which meant deploying the whole codebase every time we sync the data. I did this to save time at the beginning but now it's just an albatross around my neck.

#### New features

- UEX Prices now live update every hour. This is paving the way to the upcoming V2 upgrade of the UEX API Which should allow some amazing new Regolith features (more on that later)
- Added an "Add Row" button to the composite add tool to make it work better on mobile.
- Brought back the "refining time" and "refining cost" tables with a warning about how rough these calculations are.
- Added a Salvaging table to the market prices table page.
- Sticky first column on some of the tables.

#### Fixes

- Decreased polling interval on sessions so things should update a little snappier. Also reduced the query burden of that polling so the server should be a little happier. Happy server = happy developers = happy users!
- Slight improvement to the "Service Down" screen. We need a more robust solution for this but this will do for now. 
- Decreased load time on **profile page** by decoupling two queries that should not have been coupled in the first place.
- Added Cache-busting strategies to make the stats update more regularly
- Switched to lazy-loading for session list view. This should improve load times for users with lots of sessions and also take some query stress off the DB since very few people will ever load more than a page or two in the past.

-----

### December 22, 2023
## 1.0.44 - BUGS bugs bugs!!

- **FIX**: Users in a ship crew can disappear (including the session owner) completely from the user list when the ship captain leaves the session.
- **FIX**: Can't have more than one active module of a single type per laser in the "on" state. (eg. you can't have two surge modules active on a single laser)
- **FIX**: WHen you remove all the ores from a work order the price is now set to zero instead of freezing at the last number.
- **FIX**: No more decimals allowed on crew-share inputs

-----

### December 21, 2023
## 1.0.43 - Small fixes

- **FIX**: In the session: Work order and scouting find speed dials shouldn't be cut off by their parent containers anymore. This was preventing some people from knowing that salvaging was even possible in the app so this was a small but 100% critical fix.
- **FIX**: Share prices are no longer zero when choosing a composite sell location (like TDD & Admin for MT)
- **FIX**: Shortened the names of RMC and CMAT to save space in the WorkOrder editor
- **FIX**: Streaming mode should redact the user profile information.

-----

### December 19, 2023
## 1.0.42 - Session Dashboard rework

Note: sell prices for some of the new settlements are in.

#### Fixes:

- The session accordion has been reworked to behave better and scale better on different-sized screens. You can collapse the header now by clicking on it to get a little more screen real-estate. 
- On the PNG export screen the final sell price was reduced to a single digit. 
- Put a warning on Google log in until I can solve the problem with the refresh tokens.
- Stats were double counting some workorders and we're now filtering out ludicrous (and obviously fake) amounts from the front page stats.
- Added character counts and limits to session title and notes

-----

### December 17, 2023
## 1.0.41 - 3.22 Preliminary support

#### New features

- **New context menus** in the session list. You can now right-click on a user, a work order or a session to get a menu with some quick options.
- Refinery yield values for 3 new the **Gateway station refineries** are in and you can start using them in work orders.
- **Testing a new Error page** for catching site errors. Hopefully this will help me track down some of the more elusive bugs.
- **Construction Materials (CMAT)** are now in the game, complete with prices! Also the material code has been changed from CONST to CMAT to be more in line with UEX. You can now add them to your work orders and sell them at the market.
- Since **Construction Materials and RMC are now sold in two different places** in the same city the market price finder card is now combined to show you everything you can sell at a single landing zone.

#### Fixes

- The topbar menu is FINALLY fixed. Sorry y'all, that was a long time coming.

-----

### December 14, 2023
## 1.0.40 - 3.22 Preliminary support

This is just a quick patch to get `Construction Materials` into the game for the new salvaging workflow. 

#### New features

- `Construction Materials` and a salvage ore picker have been added. **Prices for construction materials are not in yet (Waiting on UEX)!!** so you will need to add them manually for a day or two.

#### Fixes

- Some context menu handling errors have been solved and right-clicking inside the session tools hould be allowed again.
- Icon and font adjustments


-----

### December 11, 2023
## 1.0.39 - Theme fixes

- More links now behave properly when clicked meaning you can hold Ctrl or Cmd to open them in a new tab.
- Work order and Scouting find modals on the session now accomodate mobile and small screens better.
- Dropdowns for gravity well, location type have been alphabetized.
- Settings pane now scrolls properly on mobile.
- Selecting `copper` or `iron` no longer breaks the Market Price finder.
- Misc other theme and UI fixes.

-----

### December 10, 2023
## 1.0.38 - Minor fixes

- Seconds don't matter. we shouldn't have to enter them. Second timers are fun though so they can stay on the display.
- Ore buttons in the ore chooser have better contrast when not selected
- Mass and other input text should be selected by default when focused to make it easier to type over them. Also pro users can use Tab and Shift-Tab to move forward and backward through the form to enter rocks faster.

-----

### December 6, 2023
## 1.0.37 - Icons and buttons

A number of you have reached out to give some feedback so I've made a few changes to the UI to make it a little more intuitive based on what I've been hearing.

- New explanation for new users whern there are no sessions yet. This will grow later when there are more help materials.
- Changed the add user button to make it both more compact and ituitive. There is also a menu now that includes a way to get the sharing link
- Consistency and improvements around icon choices and tooltip language.
- New menu items in the profile menu for the friend manager and session defaults.
- Profile area now has separate urls for friend list and session defaults.

-----

### December 5, 2023
## 1.0.36 - Quality of life

- Loadouts now have modal to confirm deletion
- Checkbox to sell workorders that aren't yours is now disabled
- User add modal now reacts properly to typing
- Loadouts can now use lasers of lower powers (i.e. you can use a Helix 1 on a Mole if you want). They have been sorted to the bottom and labeled clearly as this is totally valid but not very common.
- Misc other behaviour tweaks

-----


### December 3, 2023
## 1.0.35 - Quality of life

- Session expiry date now appears in the session header
- Tooltips are dialed back a bit so they don't get in the way so much
- The User Picker on the workorder has been retooled to be more friendly and useful. This is still a work in progress but after watching people struggle with it I'm making an attempt at helping to make it a little smoother.

-----

### November 25, 2023
## 1.0.34 - Sold!

You can now mark a work order as "Sold" and enter the final sell price. This will update the session stats and the crew shares. This was a little more work than I was hoping and involved a database migration but the results are definitely worth it. 

#### Work Orders

- WorkOrders **"State"** was removed because it was confusing
- **Sold** status is now on the work order line with an interactive checkbox
- **Paid** status is now on the work order line.

All work orders before today have been marked as "Sold" by default because nobody had this control before today. Apologies if this creates confusion.

Also the session list card has been updated to better communicate the state of work orders in a session. You should be able to see at a glance what is sold/unsold vs. paid/unpaid. It also works a little better on mobile.... but only a little.

-----

### November 21, 2023
## 1.0.33 - Streaming features

#### Query improvements

- I've optimized a fewqueries in an attempt to get faster load time on session pages.

#### Rock entry card

- You can now enter `instability` and `resistance` values on rocks.
- Ore percentage values now support 2 decimal places.

#### Streaming features

- **Session urls no longer let you join a session** so people won't be able to join the session just by capturing the url from your browser.
- New **session join workflow**. This could still be better but I think it's a little smoother now.
- `Streamer Mode`: in the profile menu. Toggle this on to anonymize all usernames and avatars if you want to share the session on screen without exposing any usernames.
- When exporting `.png` shares you can now choose to anonymize the export to hide all usernames and user avatars (same mechanic as `Streamer Mode`).

-----


### November 20, 2023
## 1.0.32 - Misc feedback fixes

A few quick, easy changes stemming from feedback after a successful live event over at Red Legion org.

- Added all ships to the picker, not just ones with cargo grids or mining holds.
- Better scrolling on the dashboard when there are lots of scouting finds. This component needs rewriting someday but this will keep us going for now.
- FIXED: When you mark the scoutinf find `Abandoned` or `Depleted` it no longer reverts ownership back to the session owner.
- MISC: Typos and wording changes.

-----


### November 16, 2023
## 1.0.31 - SC 3.21.1

This one is a minor patch for now. 

- Prices and UEX data has been updated
- A few small fixes
- sharing links have better previews when pasting in discord


-----


### November 12, 2023
## 1.0.30 - Proper sharing (Finally!)

I was noticing folks wanting to share their sessions without exposing a join link. This is now possible. The way it works is that you save a snapshot of your session to a png file and then upload that to Reddit, discord, twitter etc.

The benefits of this is that my server doesn't have to host the image and there's no SSR or Edge lambdas necessary to generate the image, save, host or cache it.

**Sharing!!!**

- The old share modal is now called "Invite users to join"
- The new share modal allows you to choose:
    - The whole **session** as a summary
    - A single **work order**
    - A single **scouting find** (yes, now you can offer to sell your scouting finds to other people without giving them access to your whole session)
- The share button has been added to the session, the work order modal, the scouting find modal AND the loadout calculator to make it easier to share your stuff.
- Sharing of **mining loadouts** is now in as well.

**Misc other additions**

- Rocks can now be marked "Done" and "Ignore" to signal to the scout that we don't want to break them.
- the `00:00:00:00` indicator doesn't flash if you don't put in a refinery time. (That was really annoying me).

**Bugs Fixed:**

- Bad session urls were causing crashes. Then the errors were causing more errors. Then those errors were causing crashes.
- The auto polling has been disabled when the window isn't active. This should save us potentially millions of unnecessary API calls when people leave tabs open by accident (or on purpose).
- Work orders that are delegated should now allow the delegate owner to edit and delete them properly. 
- Delegated work orders should allow the delegate owner to mark crew shares as paid.
- There were a bunch of permission issues and mutation errors when users who didn't create the scouting find were trying to modify it.

Sometimes the fixes need fixes:

HOTFIX: Immutability error: First row in expense table was not editable sometimes.
HOTFIX: stop polling on component unmount.
HOTFIX: removing the little border surrounding the share export
Spelling mistakes!
HOTFIX: sharing image crop fix (2023-11-12)
HOTFIX: Immuniability fix for scouting rocks
HOTFIX: Couldn't change user ship when "Require users to be added first." enabled
HOTFIX: Case-sensitive user names were causing duplication when pending users convert to active ones
HOTFIX: Deliberately ending a session shouldn't wipe out your session preferences


-----

### November 7, 2023
## 1.0.29 - Misc bug fixes

- Sexier page loaders! Our #1 most requested feature! 😝
- Fixed an issue allowing scientific notation in number fields.
- Fixed an issue where expense row delete buttons were showing outside of edit mode.
- Server refactor and dev mode tools added to make my life easier.

-----


### November 4, 2023
## 1.0.28 - Theme tweaks and composite adding

#### Composite Adding tool

Right now when you sell from your ship inventory you need to sell ores one at a time and then add them up. There is now a composite adding tool to help you add up prices as you go.

**Other fixes:**

- Fixing the homepage and stat theming 
- Tweaking and fixing the tabs and menus that were breaking on a lot of mobile devices.
- Misc theme cleanup

-----



### Novemebr 2, 2023
## 3.21 and beyond

This is one of those weird cases where I'm taking away features in a patch. In the latest version of the PU CIG has removed all the refinery paramters we depend on for calculating things like refinery costs. 

- **Refinery expenses on work orders will need to be entered manually until futher notice.**

I'm sure we'll be able to get back to a place where we can bring back these calculations but since we're in a period of heavy flux until Pyro launches with server meshing I'm going to focus all my efforts on 2 things:

1. Getting ready for Pyro, server meshing and anything else they are throwing our way in Q1 of 2024
2. Keeping the app usable in the meantime for the highest number of people.

-----

### October 6, 2023
## HOTFIXES

- **Login Bug**: Multiple users were reporting the innability to log into the system. This was due to a bug in the login system that was introduced in the last patch. A combination of a library operating a little differently in a newer version and a bug in my code caused the login to fail. This has been fixed and the system is back online. 
- **Extractor Power Loadout**: The extractor power loadout was not being calculated correctly. This has been fixed and the correct values are now being used.
- **Missing columns in loadout module table**: The loadout module table was missing a few columns. This has been fixed.
- **Loadout Bug Fix**: Saved loadouts should now be editable again.

-----

### September 30, 2023
## Fall 2023 update (3.20)

- **MultiCrew** is here! Now you can join someone's ship as a crewmate.
    - New work orders will automatically add all crew members.
    - Crew members that create work orders will assign the order to the Captain automatically.
    - Captains can add or remove crew members to their crew.
    - Crew members can join or leave a crew.
- **Mentioned users are now "Pending Users"** There used to be two lists, one for "Mentioned Users" and one for "Active Users" this was really confusing to people so I changed it to be one big, integrated list.
- **User list Rework** The user list should be simpler to work with now and a lot more feature-rich
    - Context menus available on right-click.
    - Click on the user to get a popup with their status.
    - Click on yourself to get a popup where you can change your status.
- **New Tool: [Market Price Calculator](https://regolith.rocks/market-price)**. This tool will help you figure out what the best price is for your ore and where to sell it.
- **Session users can now have loadouts** Advertise to the session what tools you're bringing to the party.
- **User status** 
    - Click a user in the user list to see a card showing their status, crew, ship, loadout etc.
    - Click on your own name to see a card where you can set your status, ship, loadout etc.
- **New frontpage graphs!!** Who loves data?!? ME!! I DO! I LOVE DATA!!!
- **Custom expenses** (Finally!!) One of the most requested features. You can now add your refuelling, repair and other expenses to your session. These will be deducted from the final payout before the split.
- Changelists are now in the app! You can see them on the "about" page.

- **Changes for 3.20**
    - Price updates from UEX (including new prices from Seraphim station)
    - Loadout Charge window now has a note about maxing out at 50%.

### Under the hood

- Added automation to make updating prices from UEX easier.
- Profile deletion has been completely reworked so it's more secure and less error prone.
- More activities cause the session update timestamp to be set (causing the session to stay open).
- Improved logging on the dev server
- Lots of little bug fixes

-----

### July 16, 2023
## The engine patch: v1.0.20

This patch is designed to unblock a bunch of new features I've been wanting to work on but couldn't until the foundation was laid. Also a couple of little fixes.

- Major engine updates for NodeJS, yarn etc.
    - (This was blocking all other work so it's huge to have it done!)
- Increased gem cluster count to 30
- Removed the 3.19 warnings
- Price updates
- Removed "UNKNOWN" text in the user list (better user lists coming soon!)
- Slight rework of the timeline page including Avatar groups (better timeline coming soon!)

----

### June 26, 2023
## v1.0.18 & 1.0.19 Brush your teeth!

* Mostly code hygiene and a few misc. tests
* loads of little cosmetic fixes
* Price updates
* Minor table updates


-----

### June 13, 2023
## v1.0.17 Visual Tweaks

* New main menu with submenus
* Better (but still not great) mobile responsiveness on loadout manager
* Loads of little visual tweaks (padding, margin, font sizes etc.)

-----

### June 11, 2023
## v1.0.17 Loadout Manager!

* The single biggest feature request is now in Regolith!
* **Calculate your mining stats** and deck out your ship with the best tools for the job!
* **Save your loadouts** to compare them, share them and use them again later!
* **New tables for lasers, modules and gadgets** that you can filter and sort to find the best gear for your ship!

-----

### June 05, 2023
## v1.0.16 Quality of life improvements

* You can now edit and delete work orders and add crew shares on closed sessions. This includes updating the final sell price.
* Added back crew share notes
* Improved behaviours when creating a work order for someone else.
* Several server error fixes
  
-----

### June 04, 2023
## v1.0.15 More bug fixes

* Fixing a bug on the summary page where the work orders weren't showing up.
* Lots of little visual tweaks
* Reworking number significant digits so they are more readable (i.e 1.4m instead of rounding down to 1m)
* Added a breakdown tooltip on the rock calculator for better visibility

-----

### June 02, 2023
## v1.0.14 Bug fixes and price updates

* Ongoing price updates.
* Better ore colors on the picker.
* FIX: Weird bug that would delete an empty session when you close it, causing errors.
* Package updates and security fixes.
* Misc tiny fixes probably nobody else will notice

-----

### 05 26, 2023
## v1.0.13 Bug Fixes and Performance Tweaks

- ADDED: Performance tweaks for server cost mostly. Less logging in production, making less API calls for older sessions etc.
- ADDED: Stats handler update for new pricing system
- ADDED: Better behaviour with the scouting find cards
- FIX: Creating workorders with alternate user now works on creation of workorder
- FIX: bad input bug fix where users losing input focus when entering ore values.
- FIX: the manual entry textedit for ore timer is now working again
- FIX: Rows on the work order table on dashboard did not represent their actual orders when clicking. Sort order was off too.

-----


### May 25, 2023
## v1.0.12 Manual Timers

- Could not figure out the refinery timer so I invented a control for manual entry. Sorry it's not more automatic but this is the best we can do until someone figures it out. Still, I'm pretty happy with how the control turned out! Thanks @xaliance  for the suggestion.

-----

### May 24, 2023
## v 1.0.11: Star Citizen 3.19 Support Finally Here!!!

Star Citizen 3.19 is here and with it a complete rework of the mining meta. In general this is all great news, very welcome and long overdue but it comes with a few downsides and caveats for us ~~Regolithians~~ *(~~Regolithitites~~? ~~Regal Rock Hoppers~~?.... TBD)*.

The biggest issue is the removal of information sets from the game XML files. In the past we used these files to harvest price data, refinery yield calculations etc. As the Star Citizen universe becomes more dynamic these values will be stored server-side and subject to change via in-game forces.

Again, we love that the universe is becoming more dynamic but without a public API our tools need the data to be hand collected to work.

At Regolith we are going to try to evolve to keep up with these changes so here are the broad strokes:

- **Refinery times are wrong** and we're working on it. Hopefully we can get that figure out soon™
- **Prices calculations are now simply estimates**. When you sell your ore make sure to enter what you ACTUALLY got for it using the new "final sell price" control.
- **Market Data is now harvested from UEXCorp** who have an excellent system for collecting this data.
- Rock calculation and yields data are now dependent on the completeness of your scan. Try to enter every mineral % value to get the best yield estimates.
- Feel free to give us feedback and file bugs. 

There are lots of things planned beyond this simple functionality and we will let you know here as they come online in the coming weeks. Happy mining in the new meta everyone!

-----

###  May 22, 2023
## 3.19 Update #2: Test build!!

Oof. This has been a real journey. I'm definitely not done but there is a test build now available at https://staging.regolith.rocks . All the visual stuff is done and in place but there are still some math-y issues I'm working through. Seems like both UEXCorp and all the others are having similar issues too so.... we're in good company.

**Big changes:**

- All the math has pretty much changed for mining.
- Dynamic prices and a store-chooser-helper widget. Prices now come from UEXCorp and very soon I'll have the dynamic price updates running every hour.
- New Rock calculation equations
- Huge database refactor under the hood.

**Known Issues:**

- ~~The migration didn't seem to work so old totals for old jobs are set at 0. Fix coming soon...~~ (FIXED)
- ~~Adding scouting finds was breaking the site on save~~ (FIXED)
- Some of the totals are still not adding up. I'm working through those and really hoping it's something small.

-----

### May 07, 2023
## 3.19 Update #1

3.19 is changing a lot of things and that means a lot of math is going to need to be re-thought, mandatory fields need to be re-evaluated etc. In preparation for this I've started making some of the changes to make Regolith work with 3.19.

1. You will be able create work orders for other people if you're not the ship owner / seller
2. When you sell you can type in the final sell price and this is what will be used for crew shares
3. Prices estimates have been removed in many places. Where they remain I'm adding tooltips to indicate that these values are rough estimates and don't reflect the dynamic pricing in the PU.

Lots of work left to go and 3.19 can still change so stay tuned for price updates and new features!


---

### May 01, 2023 
## v 1.0.8: Minor bug fixes

- Minor but critical rounding errors were causing validation fail. Hopefully the work order creation is unblocked again
- Some other minor tweaks and number formatting errors.


-----

###  04 28, 2023
## v 1.0.7: Bug fixes (mostly)

**FIXED**: 

- Trasfer fees were off by a factor of 10.
- Salvage prices were corrected to match the highest possible sell price.
- Summary tab stats were showing incorrect values.
- Work order SCU summary was off by a factor of 10.
- Lots of little rounding and math tweaks (mostly found by users).
- Some users were getting a white-screen error when trying to create a session. The symptom has been patched but the cause of this is still under investigation.
- Stats were tweaked and now update every hour.
- Several new developer tools were added to help track down bugs.
- Added a UserID section to the profile page so users can submit it with bug reports to help reproduce issues.

Also I've opened up a new code branch for 3.19 in order to keep bug fixing in 3.18.2 seperate from the drastic changes to mining we're all expecting in 3.19.

-----

### March 24, 2023 1:59 PM
## v 1.0.2: Prices Update
- Updated salvage RMC prices
- package security fixes

*NOTE: Some users may experience a white screen error. This is unfortunate but if you clear the cookies for the site it should come back. I'm looking into better error handling to avoid this kind of thing in the future.*

-----

### February 25, 2023
## v 1.0.0: LAUNCH!

- Cleaned up a bunch of visual stuff
- Got everything ready for 1.0.0
- Added a switcher on the standalone cluster calc
- fixed the session timeline cards
- Removed every payment row where somebody owes themselves on the summary tab
- Added summary stats to the session object! Now you can see how much aUEC in each session and lots of other stuff at a glance
- Added an FAQ (though I reserve the right to kill it later)

-----

###  February 18, 2023
## v 0.1.24: Failure is now an option!

- Work orders can be marked as "failed" with a reason (for instance: "Pirates got me on the way to market"
- Tweaking the color scheme and loads of little
- Windows Scrollbars are the worst. Begone!
- Improvements to the Summary tab from last patch 
- Still more little workflow tweaks and a load of stuff I'm sure I'm forgetting
  
-----

###  February 10, 2023
## v 0.1.23: New layouts!

- After lots of (mostly positive) feedback I've redone the session views and profile pages
- New "Summary" tab on the session page 
- Session settings is now a tab. The modal was just too much muchness.
- New "Pay all" feature on the summary tab lets you pay all shares at once.
- Slightly better mobile support (still a ways to go though)
- Slightly faster queries
- Improvements to the timeline view
- Fun new backgrounds on some of the pages
- Still more login/logout timeout fixes
- Fixed a couple of rounding errors and math glitches

-----

###  February 02, 2023
## v0.1.22: Lots of little changes this week:

- CSV and JSON download from sessions
- Session Chooser page is now in a timeline style and hopefully easier to understand.
- Site stats query paves the way for session summaries (coming soon)
- Scouting finds can now have notes
- Scouting rock count now creates an estimate for the value of your ROC rocks.
- Loads of Tooltips, help text and label enhancements 
- Lots of performance and workflow fixes
- Query tweaking to reduce data consumption
- Laying the foundations for push notifications and GQL subscriptions