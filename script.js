document.addEventListener("DOMContentLoaded", () => {
    const dataTable = document.getElementById("data-table").querySelector("tbody");
    let data = [];

    // Εμφάνιση δεδομένων στον πίνακα
    const displayData = () => {
        dataTable.innerHTML = "";
        data.forEach((entry, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${entry.invoice_no}</td>
                <td>${entry.customer_id}</td>
                <td>${entry.gender}</td>
                <td>${entry.age}</td>
                <td>${entry.category}</td>
                <td>${entry.quantity}</td>
                <td>${entry.price.toFixed(2)}</td>
                <td>${entry.payment_method}</td>
                <td>${entry.invoice_date}</td>
                <td>${entry.shopping_mall}</td>
                <td>
                    <button class="edit-btn" data-index="${index}">Επεξεργασία</button>
                </td>
            `;
            dataTable.appendChild(row);
        });
        attachEditButtons();
    };

    // Διαχείριση αρχείου CSV
    document.getElementById("csv-file").addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const csv = e.target.result;
                const rows = csv.trim().split("\n").slice(1); // Αγνοούμε την κεφαλίδα
                data = rows.map(row => {
                    const [invoice_no, customer_id, gender, age, category, quantity, price, payment_method, invoice_date, shopping_mall] = row.split(",");
                    return {
                        invoice_no,
                        customer_id,
                        gender,
                        age: parseInt(age),
                        category,
                        quantity: parseInt(quantity),
                        price: parseFloat(price),
                        payment_method,
                        invoice_date,
                        shopping_mall
                    };
                });
                displayData();
            };
            reader.readAsText(file);
        }
    });

    // Προσθήκη νέας εγγραφής
    const addNewEntry = () => {
        const newEntry = {
            invoice_no: prompt("Αριθμός Τιμολογίου:"),
            customer_id: prompt("ID Πελάτη:"),
            gender: prompt("Φύλο:"),
            age: parseInt(prompt("Ηλικία:")),
            category: prompt("Κατηγορία:"),
            quantity: parseInt(prompt("Ποσότητα:")),
            price: parseFloat(prompt("Τιμή:")),
            payment_method: prompt("Τρόπος Πληρωμής:"),
            invoice_date: prompt("Ημερομηνία (π.χ. 2025-01-25):"),
            shopping_mall: prompt("Κατάστημα:")
        };
        data.push(newEntry);
        displayData();
    };

    // Επεξεργασία εγγραφής
    const editEntry = (index) => {
        const entry = data[index];
        entry.customer_id = prompt("Νέο ID Πελάτη:", entry.customer_id);
        entry.gender = prompt("Νέο Φύλο:", entry.gender);
        entry.age = parseInt(prompt("Νέα Ηλικία:", entry.age));
        entry.category = prompt("Νέα Κατηγορία:", entry.category);
        entry.quantity = parseInt(prompt("Νέα Ποσότητα:", entry.quantity));
        entry.price = parseFloat(prompt("Νέα Τιμή:", entry.price));
        entry.payment_method = prompt("Νέος Τρόπος Πληρωμής:", entry.payment_method);
        entry.invoice_date = prompt("Νέα Ημερομηνία:", entry.invoice_date);
        entry.shopping_mall = prompt("Νέο Κατάστημα:", entry.shopping_mall);
        displayData();
    };

    // Ενεργοποίηση κουμπιών επεξεργασίας
    const attachEditButtons = () => {
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", () => {
                const index = button.getAttribute("data-index");
                editEntry(index);
            });
        });
    };

    // Εξαγωγή σε CSV
    const exportToCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "invoice_no,customer_id,gender,age,category,quantity,price,payment_method,invoice_date,shopping_mall\n";
        data.forEach(entry => {
            csvContent += `${entry.invoice_no},${entry.customer_id},${entry.gender},${entry.age},${entry.category},${entry.quantity},${entry.price},${entry.payment_method},${entry.invoice_date},${entry.shopping_mall}\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Κουμπιά
    document.getElementById("add-entry").addEventListener("click", addNewEntry);
    document.getElementById("download-csv").addEventListener("click", exportToCSV);
});