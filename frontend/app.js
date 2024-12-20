// Generate a unique session ID
const sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
sessionStorage.setItem('sessionId', sessionId);

// API endpoints configuration
const BASE_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const headers = {
    'Content-Type': 'application/json',
    'X-Session-ID': sessionId
};

// DOM Elements
const blockchainContainer = document.getElementById('blockchain');
const blockTemplate = document.getElementById('blockTemplate');
const blockDataInput = document.getElementById('blockData');
const mineBlockBtn = document.getElementById('mineBlock');
const validateChainBtn = document.getElementById('validateChain');
const resetChainBtn = document.getElementById('resetChain');
const serverStatus = document.getElementById('serverStatus');
const blockCount = document.getElementById('blockCount');
const validationStatus = document.getElementById('validationStatus');

// Server Status Check
const checkServerStatus = async () => {
    try {
        const response = await fetch(`${BASE_URL}/chain`, { headers });
        if (response.ok) {
            serverStatus.textContent = 'Server Online';
            serverStatus.classList.remove('offline');
            serverStatus.classList.add('online');
        } else {
            throw new Error();
        }
    } catch {
        serverStatus.textContent = 'Server Offline';
        serverStatus.classList.remove('online');
        serverStatus.classList.add('offline');
    }
};

// Check server status every 30 seconds
setInterval(checkServerStatus, 30000);
checkServerStatus();

// Helper Functions
const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
};

const displayError = (message) => {
    alert(`Error: ${message}`);
};

const showValidationStatus = (isValid) => {
    validationStatus.style.display = 'block';
    validationStatus.className = 'validation-status ' + (isValid ? 'valid' : 'invalid');
    
    if (isValid) {
        validationStatus.querySelector('h4').textContent = '✅ Blockchain is Valid';
        validationStatus.querySelector('p').textContent = 
            'All blocks in the chain are properly linked and their data is unmodified.';
    } else {
        validationStatus.querySelector('h4').textContent = '❌ Blockchain is Invalid';
        validationStatus.querySelector('p').textContent = 
            'One or more blocks have been corrupted or the chain links are broken. Please remine corrupted blocks to restore chain integrity.';
    }

    // Scroll to validation status
    validationStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

const hideValidationStatus = () => {
    validationStatus.style.display = 'none';
};

const updateBlockUI = (blockElement, block) => {
    blockElement.querySelector('.block-index').textContent = block.index;
    blockElement.querySelector('.block-data').value = block.data;
    blockElement.querySelector('.block-prev-hash').textContent = block.previousHash;
    blockElement.querySelector('.block-hash').textContent = block.hash;
    blockElement.querySelector('.block-nonce').value = block.nonce;
    blockElement.querySelector('.block-timestamp').textContent = formatTimestamp(block.timestamp);

    const card = blockElement.querySelector('.card');
    const statusBadge = blockElement.querySelector('.block-status');
    const remineBtn = blockElement.querySelector('.remine-btn');
    
    card.classList.remove('valid', 'corrupted');
    statusBadge.classList.remove('valid', 'corrupted');
    
    if (block.isCorrupted) {
        card.classList.add('corrupted');
        statusBadge.classList.add('corrupted');
        statusBadge.textContent = 'CORRUPTED';
        remineBtn.style.display = 'block';
    } else {
        card.classList.add('valid');
        statusBadge.classList.add('valid');
        statusBadge.textContent = 'VALID';
        remineBtn.style.display = 'none';
    }
};

const updateBlockCount = (blocks) => {
    blockCount.textContent = blocks.length;
};

const renderBlockchain = (blocks) => {
    blockchainContainer.innerHTML = '';
    updateBlockCount(blocks);
    
    blocks.forEach(block => {
        const blockElement = document.importNode(blockTemplate.content, true);
        updateBlockUI(blockElement, block);

        // Add event listeners for block actions
        const updateBtn = blockElement.querySelector('.update-block');
        const remineBtn = blockElement.querySelector('.remine-btn');
        const dataInput = blockElement.querySelector('.block-data');
        
        updateBtn.addEventListener('click', () => {
            updateBlockData(block.index, dataInput.value);
        });

        remineBtn.addEventListener('click', () => {
            remineBlock(block.index);
        });

        blockchainContainer.appendChild(blockElement);
    });
};

// API Functions
const fetchChain = async () => {
    try {
        const response = await fetch(`${BASE_URL}/chain`, { headers });
        const result = await response.json();
        
        if (result.success) {
            renderBlockchain(result.data);
        } else {
            displayError(result.error);
        }
    } catch (error) {
        displayError('Failed to fetch blockchain');
    }
};

const mineBlock = async (data) => {
    try {
        const response = await fetch(`${BASE_URL}/mine`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ data })
        });
        
        const result = await response.json();
        
        if (result.success) {
            renderBlockchain(result.data);
            blockDataInput.value = '';
            hideValidationStatus();
        } else {
            displayError(result.error);
        }
    } catch (error) {
        displayError('Failed to mine block');
    }
};

const updateBlockData = async (index, newData) => {
    try {
        const response = await fetch(`${BASE_URL}/block/update`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ index, data: newData })
        });
        
        const result = await response.json();
        
        if (result.success) {
            renderBlockchain(result.data);
            hideValidationStatus();
        } else {
            displayError(result.error);
        }
    } catch (error) {
        displayError('Failed to update block');
    }
};

const remineBlock = async (index) => {
    try {
        const response = await fetch(`${BASE_URL}/block/remine`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ index })
        });
        
        const result = await response.json();
        
        if (result.success) {
            renderBlockchain(result.data);
            hideValidationStatus();
        } else {
            displayError(result.error);
        }
    } catch (error) {
        displayError('Failed to remine block');
    }
};

const validateChain = async () => {
    try {
        const response = await fetch(`${BASE_URL}/validate`, { headers });
        const result = await response.json();
        
        if (result.success) {
            showValidationStatus(result.data.isValid);
        } else {
            displayError(result.error);
        }
    } catch (error) {
        displayError('Failed to validate chain');
    }
};

const resetChain = async () => {
    try {
        const response = await fetch(`${BASE_URL}/reset`, {
            method: 'POST',
            headers
        });
        
        const result = await response.json();
        
        if (result.success) {
            renderBlockchain(result.data);
            hideValidationStatus();
        } else {
            displayError(result.error);
        }
    } catch (error) {
        displayError('Failed to reset chain');
    }
};

// Event Listeners
mineBlockBtn.addEventListener('click', () => {
    const data = blockDataInput.value.trim();
    if (data) {
        mineBlock(data);
    } else {
        displayError('Please enter block data');
    }
});

validateChainBtn.addEventListener('click', validateChain);
resetChainBtn.addEventListener('click', resetChain);

// Initialize the blockchain
resetChain(); 