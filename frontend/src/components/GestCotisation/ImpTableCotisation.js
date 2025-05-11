export const ImpTableCotisation = () => {
  const content = document.getElementById("tableCotisations");
  if (!content) {
    alert("Le tableau à imprimer est introuvable.");
    return;
  }

  const printWindow = window.open("", "", "height=600,width=800");

  printWindow.document.write(`
    <html>
      <head>
        <title>Impression des Cotisations</title>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 1em;
            font-family: Arial, sans-serif;
          }
          th, td {
            padding: 12px;
            border: 1px solid #ddd;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          h2 {
            text-align: center;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <h2>Suivi des Cotisations</h2>
        ${content.outerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};
