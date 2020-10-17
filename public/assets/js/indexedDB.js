let db;

//request a db instance
const request = indexedDB.open("budgetTracker", 1);

//create an object store inside the onupgradeneeded method
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    //store / hold the value of objectStore
    db.createObjectStore("pending", {autoIncrement: true });
};

//opens a transaction
request.onsuccess = function(event) {
    //access the db
    db = event.target.result;
    
    //check if app is online before reading from db
    if (navigator.online) {
        checkDatabase();
    }
};

    request.onerror = function(event) {
    console.log("Woops! " + event.target.errorCode);
};

    function saveRecord(record) {
        //create transaction on the pending db w/readwrite access
        const transaction = db.transaction(["pending"], "readwrite");
        //access pending object store
        const store = transaction.objectStore("pending");
        //add record to your store w/add method
        store.add(record);
    }

    function checkDatabase() {
        const transaction = db.transaction(["pending"], "readwrite");
        const store = transaction.objectStore("pending");
        //get all records from store and set to a variable
        const  getAll = store.getALl();

        getAll.onsuccess = function() {
            if (getAll.result.length > 0) {
                fetch("/api/transaction/bulk", {
                    method: "POST",
                    body: JSON.stringify(getAll.result),
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json"
                    }
                })
                .then(response => response.json())
                .then(() => {
                    //if successful, open a transaction on your pending db
                    const transaction = db.transaction(["pending"], "readwrite");
                    //access your pending object store
                    const store = transaction.objectStore("pending");

                    //clear all items in your store
                    store.clear();
                });
            }
        };

    }

    //listen for app coming back online
    window.addEventListener("online", checkDatabase);

   
