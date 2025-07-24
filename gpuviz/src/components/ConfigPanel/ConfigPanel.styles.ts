import type { CSSProperties } from 'react';

export const styles = {
  collapsedContainer: {
    position: 'fixed',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#f0f0f0',
    padding: '8px',
    cursor: 'pointer',
    borderRadius: '0 4px 4px 0'
  } as CSSProperties,

  mainContainer: {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    width: '250px',
    backgroundColor: '#f5f5f5',
    borderRight: '1px solid #ddd',
    display: 'flex',
    flexDirection: 'column'
  } as CSSProperties,

  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #ddd'
  } as CSSProperties,

  chevronButton: {
    marginRight: '8px',
    cursor: 'pointer'
  } as CSSProperties,

  title: {
    fontWeight: 'bold'
  } as CSSProperties,

  section: {
    padding: '16px',
    borderBottom: '1px solid #ddd'
  } as CSSProperties,

  levelInput: {
    marginLeft: '8px',
    width: '60px'
  } as CSSProperties,

  filterButtonGroup: {
    marginTop: '8px'
  } as CSSProperties,

  filterButton: (isActive: boolean): CSSProperties => ({
    padding: '4px 12px',
    marginRight: '4px',
    backgroundColor: isActive ? '#4CAF50' : '#fff',
    color: isActive ? '#fff' : '#000',
    border: '1px solid #ccc',
    cursor: 'pointer'
  }),

  itemList: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    borderBottom: '1px solid #ddd'
  } as CSSProperties,

  itemLabel: {
    display: 'block',
    marginBottom: '8px',
    cursor: 'pointer'
  } as CSSProperties,

  itemCheckbox: {
    marginRight: '8px'
  } as CSSProperties,

  submitSection: {
    padding: '16px'
  } as CSSProperties,

  submitButton: {
    width: '100%',
    padding: '8px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px'
  } as CSSProperties
};