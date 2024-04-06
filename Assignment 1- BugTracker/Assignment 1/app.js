let contract;

$(document).ready(() => {
    initApp();
});

async function initApp() {
    try {
        await getAccount();
        contract = new web3.eth.Contract(contractABI, contractAddress);
        await createBugList();
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

async function createBugList() {
    try {
        let bugNum = await contract.methods.getBugCount().call({ from: web3.eth.defaultAccount });
        let bugListElement = $('#bugList');
        bugListElement.empty();
        
        for (let i = 0; i < bugNum; i++) {
            let bug = await contract.methods.getBug(i).call({ from: web3.eth.defaultAccount });
            let criticality = '';
            switch (bug[2]) {
                case 0n:
                    criticality = 'Low';
                    break;
                case 1n:
                    criticality = 'Medium';
                    break;
                case 2n:
                    criticality = 'High';
                    break;
                default:
                    criticality = 'Unknown';
            }
            console.log(bug)
            let listItem = $('<li>').addClass('list-group-item').text(`ID : ${bug[0]}   ,     Description  - ${bug[1]}    ,   Criticality - ${criticality}   ,    Resolve - ${bug[3]}`);
            bugListElement.append(listItem);
        }
    } catch (error) {
        console.error(error);
    }
}

$('#addBugForm').submit(async (event) => {
    event.preventDefault();
    try {
        let id = $('#bugId').val();
        let description = $('#bugDescription').val();
        let criticality = $('#bugCriticality').val();
        await contract.methods.addBug(id, description, criticality).send({ from: web3.eth.defaultAccount, gas: 5000000 });
        await createBugList();
        $('#addBugModal').modal('hide');
    } catch (error) {
        console.error('Error adding bug:', error);
    }
});

$('#deleteBugBtn').click(async () => {
    try {
        let confirmDelete = confirm('Are you sure you want to delete this bug?');
        if (confirmDelete) {
            let bugIndex = $('#bugList .list-group-item.active').index();
            await contract.methods.deleteBug(bugIndex).send({ from: web3.eth.defaultAccount, gas: 5000000 });
            await createBugList();
            $('#updateBugBtn, #deleteBugBtn').prop('disabled', true);
        }
    } catch (error) {
        console.error('Error deleting bug:', error);
    }
});

$('#bugList').on('click', '.list-group-item', function () {
    $('#bugList .list-group-item').removeClass('active');
    $(this).addClass('active');
    $('#updateBugBtn, #deleteBugBtn').prop('disabled', false);
});

$('#updateBugBtn').click(async () => {
    try {
        let bugIndex = $('#bugList .list-group-item.active').index();
        let id = prompt('Enter the updated Bug ID:');
        let description = prompt('Enter the updated Description:');
        let criticality = prompt('Enter the updated Criticality:');
        let status = confirm('Mark as resolved?');

        // Convert criticality to a number
        let criticalityValue;
        switch (criticality.toLowerCase()) {
            case 'low':
                criticalityValue = 0;
                break;
            case 'medium':
                criticalityValue = 1;
                break;
            case 'high':
                criticalityValue = 2;
                break;
            default:
                throw new Error('Invalid criticality value');
        }

        await contract.methods.updateBug(bugIndex, id, description, criticalityValue, status)
            .send({ from: web3.eth.defaultAccount, gas: 5000000 });
        await createBugList();
    } catch (error) {
        console.error('Error updating bug:', error);
    }
});
