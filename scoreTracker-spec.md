# Sport ScoreTracker App

Simple App that will track and display games, results and players in different sports


###############################

# Sports
  
  - Sport ID
  - Sport name

# Teams
  
  - Team ID
  - Team name
  - Sport ID
  - Number of W / D / L

# Games 

  - Game ID
  - Sport ID
  - Team's ID
  - Team's names
  - Team's score

# Players

  - Player ID
  - Team ID
  - First name
  - Last name
  - Position
  - Jersy number


###############################

# API

# Create sport 

  Create sport with valid name and unique ID number

# Delete sport 

  Delete sport based on ID (and delete teams)

# Create team in sport

  Create team with name, team ID and sport ID number

# Delete team in sport

  Delete team based on ID

# Display Table

  Display teams with same sport ID decreasingly by number of point with displayed team names, number of W / D / L, number of games and number of points

# Create games 

  Create games with Game ID, (team's ID), team's name, team's score

# Update number of points for every team

  Add points to teams based on game result 
 
# Attach win, draw or lose for team

  Increase number of wins, draws or losses for each team 

# Create player in team 

  Create player with player ID, team ID, first name, last name, position, jersy number

# Connect player with team 

  Connect player ID to team ID
  ("#Connect teams with sport" could be done same as this)
  (Not sure if this is necessary since we have team ID in player creation)

# Delete player in sport

  Delete player based on ID

# Display players in team

  Display players with same team ID with displayed first name, last name, position and jersy number

