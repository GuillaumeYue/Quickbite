import { useState } from 'react';

const CATS = ['mains', 'sides', 'drinks', 'dessert'];

function MenuItemForm({ item, onSave, onClose }) {
  const isEdit = Boolean(item && item._id);
  const [name, setName] = useState(item ? item.name || '' : '');
  const [description, setDescription] = useState(item ? item.description || '' : '');
  const [price, setPrice] = useState(item ? String(item.price || '') : '');
  const [category, setCategory] = useState(item ? item.category || 'mains' : 'mains');
  const [imageUrl, setImageUrl] = useState(item ? item.imageUrl || '' : '');
  const [available, setAvailable] = useState(item ? item.available !== false : true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const num = Number(price);
    if (!name || isNaN(num) || num < 0) {
      setError('Name and a valid price are required');
      return;
    }
    setSaving(true);
    try {
      await onSave({
        name: name,
        description: description,
        price: num,
        category: category,
        imageUrl: imageUrl,
        available: available
      });
    } catch (err) {
      const msg = err.response && err.response.data && err.response.data.message;
      setError(msg || 'Could not save');
      setSaving(false);
    }
  }

  function handleOverlay(e) {
    if (e.target.classList.contains('modal-overlay')) onClose();
  }

  return (
    <div className="modal-overlay" onClick={handleOverlay}>
      <div className="modal">
        <h2>{isEdit ? 'Edit item' : 'Add menu item'}</h2>
        {error ? <div className="modal-error">{error}</div> : null}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Name</label>
            <input value={name} onChange={function(e) { setName(e.target.value); }} required />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea rows={2} value={description} onChange={function(e) { setDescription(e.target.value); }} />
          </div>
          <div className="row">
            <div className="field">
              <label>Price (CAD)</label>
              <input type="number" step="0.01" min="0" value={price} onChange={function(e) { setPrice(e.target.value); }} required />
            </div>
            <div className="field">
              <label>Category</label>
              <select value={category} onChange={function(e) { setCategory(e.target.value); }}>
                {CATS.map(function(c) {
                  return <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>;
                })}
              </select>
            </div>
          </div>
          <div className="field">
            <label>Image URL (optional)</label>
            <input value={imageUrl} onChange={function(e) { setImageUrl(e.target.value); }} placeholder="https://..." />
          </div>
          <div className="field">
            <label>
              <input type="checkbox" checked={available} onChange={function(e) { setAvailable(e.target.checked); }} style={{ width: 'auto', marginRight: 8 }} />
              Available for ordering
            </label>
          </div>
          <div className="modal-foot">
            <button type="button" className="cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="save" disabled={saving}>
              {saving ? 'Saving...' : (isEdit ? 'Save changes' : 'Add item')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MenuItemForm;
