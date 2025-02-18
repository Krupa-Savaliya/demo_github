const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());

const DATA_FILE = 'earnings.json';


    const loadEarnings = () => {
        try {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data).totalEarnings || 0;
        } catch (error) {
            return 0; 
        }
    };


const saveEarnings = (totalEarnings) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ totalEarnings }), 'utf8');
};

let totalEarnings = loadEarnings();


app.post('/earnings', (req, res) => {
    const { amount } = req.body;

    if (amount === undefined) {
        return res.status(400).json({ message: "Amount is required in the request body." });
    }

    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: `Invalid amount: ${amount}. Please enter a positive number.` });
    }

    totalEarnings += amount;
    saveEarnings(totalEarnings); // Save updated earnings

    res.json({
        message: 'Earning added successfully',
        total_earnings: totalEarnings
    });
});

// GET route to fetch total earnings
app.get('/earnings', (req, res) => {
    res.json({ total_earnings: totalEarnings });
});



//----------------------order file-----------------------------------------------------------------------------------------------------------------------


const DATA_FILEORDER = 'orders.json';

// Load stored data
const loadData = () => {
    try {
        const data = fs.readFileSync(DATA_FILEORDER, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { totalOrderMonth: 0, totalOrderYear: 0, lastOrderDate: new Date().toISOString() };
    }
};

// Save data to file
const saveData = (data) => {
    fs.writeFileSync(DATA_FILEORDER, JSON.stringify(data, null, 2), 'utf8');
};

let { totalOrderMonth, totalOrderYear, lastOrderDate } = loadData();

// Function to reset monthly and yearly orders if needed
const checkAndResetOrders = () => {
    const currentDate = new Date();
    const lastDate = new Date(lastOrderDate);

    // Reset monthly orders if a new month starts
    if (currentDate.getMonth() !== lastDate.getMonth() || currentDate.getFullYear() !== lastDate.getFullYear()) {
        totalOrderMonth = 0;
    }

    // Reset yearly orders if a new year starts
    if (currentDate.getFullYear() !== lastDate.getFullYear()) {
        totalOrderYear = 0;
    }

    lastOrderDate = currentDate.toISOString();
    saveData({ totalOrderMonth, totalOrderYear, lastOrderDate });
};

// GET total orders for the month
app.get('/order/month', (req, res) => {
    checkAndResetOrders();
    res.json({ total_orders: totalOrderMonth });
});

// GET total orders for the year
app.get('/order/year', (req, res) => {
    checkAndResetOrders();
    res.json({ total_orders: totalOrderYear });
});

// POST new order (adds to both month & year)
app.post('/order', (req, res) => {
    console.log('Received data:', req.body); // Debugging line

    const { order } = req.body;  // Changed from `amount` to `order`

    if (typeof order !== 'number' || order <= 0) {
        return res.status(400).json({ message: 'Invalid order. Please enter a positive number.' });
    }

    totalOrderMonth += order;
    totalOrderYear += order;

    saveData({ totalOrderMonth, totalOrderYear, lastOrderDate });

    res.json({
        message: 'Order added successfully!',
        total_orders_month: totalOrderMonth,
        total_orders_year: totalOrderYear
    });
});


//---------------------------------income data-------------------------------------------------------------------------------------------------------


const DATA_FILEINCOM = './income.json';




const loadIncome = () => {
    try {
        const data = fs.readFileSync(DATA_FILEINCOM, 'utf8');
        return JSON.parse(data).total_income || 0;
    } catch (error) {
        console.error('Error reading income file:', error.message);
        return 0;
    }
};

const saveIncome = (totalIncome) => {
    try {
        fs.writeFileSync(DATA_FILEINCOM, JSON.stringify({ total_income: totalIncome }, null, 2));
    } catch (error) {
        console.error('Error saving income file:', error.message);
    }
};

let totalIncome = loadIncome(); 

app.post('/income', (req, res) => {
    const { amount } = req.body;

    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount. Must be a positive number.' });
    }

    totalIncome += amount;
    saveIncome(totalIncome); 

    res.json({ message: 'Income added successfully', total_income: totalIncome });
});

 
app.get('/income', (req, res) => {
    res.json({ total_income: totalIncome });
});




//-----------------------------Total Growth-----------------------------------------------------------------------------------------------------


const FILE_PATH = './growth.json';


function readGrowthData() {
    try {
        if (!fs.existsSync(FILE_PATH)) {
            fs.writeFileSync(FILE_PATH, JSON.stringify({ total_growth: 0 }, null, 2));
        }
        const rawData = fs.readFileSync(FILE_PATH, 'utf-8');
        return rawData.trim() ? JSON.parse(rawData) : { total_growth: 0 };
    } catch (error) {
        console.error('Error reading growth file:', error.message);
        return { total_growth: 0 };
    }
}

// Load growth data
let growthData = readGrowthData();

// POST route to add growth data
app.post('/growth', (req, res) => {
    const { amount } = req.body;

    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount. Please enter a positive number." });
    }

    growthData.total_growth += amount;

    fs.writeFileSync(FILE_PATH, JSON.stringify(growthData, null, 2));

    res.json({
        message: "Growth updated successfully",
        total_growth: growthData.total_growth
    });
});

// GET route to fetch total growth data
app.get('/growth', (req, res) => {
    res.json(growthData);
});

//-----------------------------------------------populat card--------------------------------------------------------------------------


const STOCKS_FILE = 'stocks.json';


const loadStocks = () => {
    try {
        const data = fs.readFileSync(STOCKS_FILE, 'utf8');
        return JSON.parse(data) || [];
    } catch (error) {
        return [];
    }
};

// Save stocks to file
const saveStocks = (stocks) => {
    fs.writeFileSync(STOCKS_FILE, JSON.stringify(stocks, null, 2), 'utf8');
};

// Load stored stocks
let stocks = loadStocks();


app.get('/stocks', (req, res) => {
    const sortedStocks = stocks.sort((a, b) => b.popularity - a.popularity);
    res.json(sortedStocks);
});

// POST route to add a stock
app.post('/stocks', (req, res) => {
    const { name, price, popularity, change } = req.body;

    if (!name || typeof price !== 'number' || typeof popularity !== 'number' || typeof change !== 'number') {
        return res.status(400).json({ message: 'Invalid data. Ensure name, price, popularity, and change are provided correctly.' });
    }

    stocks.push({ name, price, popularity, change });
    saveStocks(stocks);

    res.json({ message: 'Stock added successfully!', stocks });
});

//----------------------------chart bar-------------------------------------------------------------------
app.get('/chart-data', (req, res) => {
    res.json({
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      series: [
        { name: 'Investment', data: [35, 125, 35, 35, 35, 80, 35, 20, 35, 45, 15, 75] },
        { name: 'Loss', data: [35, 15, 15, 35, 65, 40, 80, 25, 15, 85, 25, 75] },
        { name: 'Profit', data: [35, 145, 35, 35, 20, 105, 100, 10, 65, 45, 30, 10] },
        { name: 'Maintenance', data: [0, 0, 75, 0, 0, 115, 0, 0, 0, 0, 150, 0] }
      ]
    });
  });
  
  
  

// Start the server
const PORT = 5001;
app.listen(PORT, () => console.log(`Growth server running on port ${PORT}`));