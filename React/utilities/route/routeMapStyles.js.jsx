const routeMapStyles = `
    body {
        margin: 0;
        padding: 0;
        background-color: #fff;
    }
    #map {
        height: 100vh;
        width: 100vw;
        border-radius: 10px;
    }
    .error-message {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(239, 68, 68, 0.9);
        color: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        z-index: 1000;
        max-width: 80%;
    }
    .route-popup {
        font-size: 14px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.98);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        border: 3px solid;
        min-width: 150px;
    }
    .route-popup strong {
        display: block;
        margin-bottom: 6px;
        font-size: 16px;
        font-weight: bold;
    }
    .route-popup b {
        color: #1e40af;
        font-weight: 600;
    }
    
    /* Custom div icon container */
    .custom-div-icon {
        background: transparent !important;
        border: none !important;
    }
    
    /* Custom marker styles */
    .custom-marker {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 20px;
        color: white;
        box-shadow: 0 6px 12px rgba(0,0,0,0.4);
        border: 4px solid white;
        transition: transform 0.2s;
        cursor: pointer;
    }
    .custom-marker:hover {
        transform: scale(1.15);
    }
    .marker-start {
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        animation: bounce 2s ease-in-out infinite;
    }
    .marker-stop {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }
    .marker-end {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        animation: bounce 2s ease-in-out infinite;
        animation-delay: 0.5s;
    }
    
    @keyframes bounce {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-5px);
        }
    }
    
    /* User location marker */
    .user-location-marker {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #2563eb;
        border: 4px solid white;
        box-shadow: 0 0 20px rgba(37, 99, 235, 0.7);
        animation: pulse 2s infinite;
    }
    @keyframes pulse {
        0% {
            box-shadow: 0 0 20px rgba(37, 99, 235, 0.7);
            transform: scale(1);
        }
        50% {
            box-shadow: 0 0 30px rgba(37, 99, 235, 0.9);
            transform: scale(1.1);
        }
        100% {
            box-shadow: 0 0 20px rgba(37, 99, 235, 0.7);
            transform: scale(1);
        }
    }
    
    .user-location-accuracy {
        border-radius: 50%;
        fill-opacity: 0.15;
        stroke-opacity: 0.3;
        fill: #2563eb;
        stroke: #2563eb;
        stroke-width: 2;
    }
    
    /* Location name labels */
    .location-name-label {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
    }
    
    .location-name-label span {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        border: 2px solid;
        white-space: nowrap;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    /* Ensure tooltips are visible */
    .leaflet-tooltip {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
    }
    
    .leaflet-tooltip-bottom:before {
        border: none !important;
    }
`;

export default routeMapStyles;