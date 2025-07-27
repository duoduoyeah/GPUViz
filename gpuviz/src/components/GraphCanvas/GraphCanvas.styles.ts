import type { CSSProperties } from 'react';

export const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#f9f9f9',
    overflow: 'hidden'
  } as CSSProperties,

  graphContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0'
  } as CSSProperties,

  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px'
  } as CSSProperties,

  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  } as CSSProperties,

  loadingText: {
    fontSize: '16px',
    color: '#666',
    fontWeight: '500'
  } as CSSProperties,

  errorContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    backgroundColor: '#ffebee',
    border: '1px solid #e57373',
    borderRadius: '4px',
    maxWidth: '400px',
    textAlign: 'center'
  } as CSSProperties,

  errorText: {
    color: '#c62828',
    fontSize: '14px',
    fontWeight: '500'
  } as CSSProperties,

  emptyContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center'
  } as CSSProperties,

  emptyText: {
    fontSize: '18px',
    color: '#999',
    fontWeight: '500'
  } as CSSProperties,

  nodeInfo: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    padding: '12px',
    minWidth: '200px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  } as CSSProperties,

  nodeInfoTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '4px'
  } as CSSProperties,

  nodeInfoContent: {
    fontSize: '12px',
    color: '#666',
    lineHeight: '1.4'
  } as CSSProperties,

  // CSS animation for loading spinner
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  } as CSSProperties
};

// Cytoscape style configuration
export const cytoscapeStyles = [
  {
    selector: 'node',
    style: {
      'shape': 'rectangle' as const,
      'background-color': '#3498db', // Same blue color for all nodes
      'label': 'data(label)',
      'text-valign': 'center' as const,
      'text-halign': 'center' as const,
      'color': '#fff',
      'font-size': '12px',
      'width': '60px',
      'height': '60px',
      'border-width': '2px',
      'border-color': '#2980b9'
    }
  },
  {
    selector: ':selected',
    style: {
      'background-color': '#e74c3c',
      'border-color': '#c0392b'
    }
  }
];

// Layout configuration
export const cytoscapeLayout = {
  name: 'grid',
  fit: true,
  padding: 20
};