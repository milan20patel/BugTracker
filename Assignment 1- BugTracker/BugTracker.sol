// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract BugTracker {
    enum Criticality {
        Low,
        Medium,
        High
    }

    struct Bug {
        string id;
        string description;
        Criticality criticality;
        bool isResolved;
    }

    Bug[] public bugs;

    function addBug(
        string memory _id,
        string memory _description,
        Criticality _criticality
    ) public {
        bugs.push(Bug(_id, _description, _criticality, false));
    }

    function getBug(uint256 _index)
        public
        view
        returns (
            string memory,
            string memory,
            Criticality,
            bool
        )
    {
        require(_index < bugs.length, "Bug index out of bounds");
        Bug storage bug = bugs[_index];
        return (bug.id, bug.description, bug.criticality, bug.isResolved);
    }

    function updateBugStatus(uint256 _index, bool _status) public {
        require(_index < bugs.length, "Bug index out of bounds");
        bugs[_index].isResolved = _status;
    }

    function getBugCount() public view returns (uint256) {
        return bugs.length;
    }

    function updateBug(
        uint256 _index,
        string memory _id,
        string memory _description,
        Criticality _criticality,
        bool _status
    ) public {
        require(_index < bugs.length, "Bug index out of bounds");
        bugs[_index].id = _id;
        bugs[_index].description = _description;
        bugs[_index].criticality = _criticality;
        bugs[_index].isResolved = _status;
    }

    function deleteBug(uint256 _index) public {
        require(_index < bugs.length, "Bug index out of bounds");
        // Move the last bug to the deleted bug's position
        bugs[_index] = bugs[bugs.length - 1];
        // Remove the last bug from the array
        bugs.pop();
    }
}