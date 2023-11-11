# Stockfolio

<img width="1109" alt="stockfolio cover" src="https://github.com/skeyan/stock-portfolio/assets/43856300/1ea1f8a3-9944-4d6d-b782-4942b5e1c647">
A simple full-stack app where a user can login, buy, and manage stocks.

<div align="center">  
  <a href="https://stockfolio-frontend.netlify.app/" target="_blank">Link to Deployed Site</a>
  Contact: <a href="https://www.linkedin.com/in/sk-evayan/" target="_blank">LinkedIn</a>
</div>

---

## Built With
* React, Redux, Node.js
* Express, MongoDB
* CSS

### Deployment Infra
Formerly deployed with Heroku. Following its decommission of free tiers, this has since been updated in 2023 to be deployed with:
* Netlify for the front-end React app
* Vercel for the back-end Express server

**Important Note:** Due to the usage of free tiers, there is a only certain limit of API calls per month. 

## User Flow
- Register for an account on the **Register page**.   
- Then, log in with your credentials on the **Login page**.  
- Go to the **Portfolio page** and enter a ticket symbol to purchase stock shares - every account begins with $5000.  
- Monitor your stocks on the **Portfolio page**, or go to your **Transactions page** to see your purchase history.  
- Log out and log back in at any time

## Running Locally
**Important Note:** Due to the necessity of env configs, the application will not function by default.
Please reach out to me if you require env configurations. The site can currently be tested here on [Netlify](https://stockfolio-frontend.netlify.app/).

Front-end:
- Run `npm start` while in the root directory of the front-end app, ie. (stock-portfolio/front-end). It should run on https://localhost:3000.

Back-end:
- The back-end was made with Node.js and Express with the help of MongoDB.  
- To run this locally, run `nodemon index.js` or `node index.js` while in the root directory of the app, ie. (stock-portfolio). It should run on http://localhost:3500.  
