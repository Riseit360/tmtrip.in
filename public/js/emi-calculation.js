// range inputs
$('#monthsRange, #interestRange').on('input', function () {
    // Check which range input is being changed
    if ($(this).attr('id') === 'monthsRange') {
        var monthsValue = $(this).val();
        $('#monthsValue').val(monthsValue);
        // Adjust the progress indicator
        $(this).css('--webkitProgress', (monthsValue - $(this).attr('min')) / ($(this).attr('max') - $(this).attr('min')) * 100 + '%');
    } else if ($(this).attr('id') === 'interestRange') {
        var interestValue = parseFloat($(this).val()).toFixed(2);
        $('#interestValue').val(interestValue);
        // Adjust the progress indicator
        $(this).css('--webkitProgress', (interestValue - $(this).attr('min')) / ($(this).attr('max') - $(this).attr('min')) * 100 + '%');
    }
});

// the monthsValue input field
$('#monthsValue').on('input', function () {
    var monthsValue = $(this).val();
    $('#monthsRange').val(monthsValue);
    // Adjust the progress indicator
    $('#monthsRange').css('--webkitProgress', (monthsValue - $('#monthsRange').attr('min')) / ($('#monthsRange').attr('max') - $('#monthsRange').attr('min')) * 100 + '%');
});

// the input field inside the span for interestValue
$('#interestValue').closest('span').find('input').on('input', function () {
    var interestValue = $(this).val();
    $('#interestRange').val(interestValue);
    // Adjust the progress indicator
    $('#interestRange').css('--webkitProgress', (interestValue - $('#interestRange').attr('min')) / ($('#interestRange').attr('max') - $('#interestRange').attr('min')) * 100 + '%');
});




// Chart
jQuery(document).ready(function ($) {
    google.charts.load('45.1', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        // Initialize chart with default data
        updateDataAndChart();
    }
});

// Function to update Google Charts data and report
function updateDataAndChart() {
    // Get the values from the calculator section
    const principal = parseFloat(document.getElementById('loanamount').value);
    const numMonths = parseInt(document.getElementById('monthsValue').value);
    const interestRate = parseFloat(document.getElementById('interestValue').value);

    // Calculate EMI, total interest, and total payable amount
    const monthlyInterestRate = interestRate / 12 / 100;
    const monthlyPayment = principal * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -numMonths));
    const totalInterest = monthlyPayment * numMonths - principal;
    const totalPayableAmount = principal + totalInterest;

    // Update the Google chart and report
    updateGoogleChartData(principal, numMonths, interestRate, monthlyPayment, totalInterest, totalPayableAmount);
}


// Function to update the chart and report
function updateGoogleChartData(principal, numMonths, interestRate, emiAmount, totalInterest, totalPayableAmount) {
    // Report Ghaph Calculator 
    var interstamout = totalInterest / totalPayableAmount * 100;
    var princialacmout = principal / totalPayableAmount * 100;

    var data = google.visualization.arrayToDataTable([
        ['Expense', 'Amount', { role: 'tooltip', p: { html: true } }],
        ['Principal Amount', princialacmout, 'â‚¹' + formatCurrency(principal)],
        ['Interest Amount', interstamout, 'â‚¹' + formatCurrency(totalInterest)]
    ]);

    var formatter = new google.visualization.NumberFormat({
        negativeColor: 'Green',
        negativeParens: true,
        pattern: '$###,###'
    });
    formatter.format(data, 1);

    var options = {
        is3D: true,
        slices: { 4: { color: 'MediumSeaGreen' }, 5: { color: 'DarkRed' } },
        chartArea: { width: '100%', height: '100%' },
        legend: { position: 'absolute', bottom: '0', left: '0', alignment: 'center', textStyle: { fontSize: 11 } },
    };
    var chart = new google.visualization.PieChart(document.getElementById('Chartresldata'));
    chart.draw(data, options);

    // Update the report section
    document.getElementById('emiAmount').innerText = formatCurrency(emiAmount);
    document.getElementById('totalInterest').innerText = formatCurrency(totalInterest);
    document.getElementById('totalPayableAmount').innerText = formatCurrency(totalPayableAmount);
}

// Function to format currency with commas
function formatCurrency(amount) {
    return Math.round(amount).toLocaleString('en-IN');
}

// Event listeners to update the chart and report when inputs change
document.querySelectorAll('.emicalseardes input').forEach(input => {
    input.addEventListener('input', updateDataAndChart);
});

// Initial update 
updateDataAndChart();
