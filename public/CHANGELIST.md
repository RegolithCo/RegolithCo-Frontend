### November 7, 2023
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

- The auto polling has been disabled when the window isn't active. This should save us potentially millions of unecessary API calls when people leave tabs open by accident (or on purpose).
- Work orders that are delegated should now allow the delegate owner to edit adn delete them properly. 
- Delegated work orders should allow the delegate owner to mark crew shares as paid.
- There were a bunch of permission issues and mutation errors when users who didn't create the scouting find were trying to modify it.

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
- **New Tool: [Market Price Calculator](https://regolith.rocks/marketPrice)**. This tool will help you figure out what the best price is for your ore and where to sell it.
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