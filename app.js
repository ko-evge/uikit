/**
 * IMS2 - Main Application
 * Using UIKit library
 */

export const App = {
  user: null,
  kdus: null,

  init: async () => {
    // Check if logged in
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (user && token) {
      App.user = JSON.parse(user);
      App.kdus = App.user.kdus;
      App.showMain();
    } else {
      App.showLogin();
    }
  },

  /**
   * Show login page
   */
  showLogin: () => {
    const app = document.getElementById('app');
    app.innerHTML = '';

    // Container
    const container = new Base();
    container.createElement('div', 'ui-container');
    container.setStyle('max-width', '400px');
    container.setStyle('margin', '50px auto');

    // Title
    const title = new Base();
    title.createElement('h1');
    title.element.textContent = '🔐 IMS 2 Login';

    // Form
    const form = new Base();
    form.createElement('div', 'ui-form-group');

    // Username
    const usernameLabel = new Label('Username');
    const usernameInput = new Input('text', 'Enter username');
    usernameInput.element.id = 'username';

    // Password
    const passwordLabel = new Label('Password');
    const passwordInput = new Input('password', 'Enter password');
    passwordInput.element.id = 'password';

    // Submit button
    const submitBtn = new Button('Login', async () => {
      const user = usernameInput.getValue();
      const pass = passwordInput.getValue();

      if (!user || !pass) {
        App.showAlert('Please fill all fields', 'error');
        return;
      }

      try {
        const result = await API.auth.login(user, pass);

        localStorage.setItem('user', JSON.stringify(result));
        localStorage.setItem('token', result.token);

        App.user = result;
        App.kdus = result.kdus;

        App.showAlert('Login successful!', 'success');
        App.showMain();
      } catch (error) {
        App.showAlert('Login failed: ' + error.message, 'error');
      }
    });
    submitBtn.element.style.width = '100%';
    submitBtn.element.style.marginTop = '16px';

    // Assemble form
    form.append(usernameLabel);
    form.append(usernameInput);
    form.append(passwordLabel);
    form.append(passwordInput);
    form.append(submitBtn);

    container.append(title);
    container.append(form);

    app.appendChild(container.getDOMElement());
  },

  /**
   * Show main app
   */
  showMain: () => {
    const app = document.getElementById('app');
    app.innerHTML = '';

    // Header
    const header = new Base();
    header.createElement('div', 'ui-container');
    header.element.style.marginBottom = '0';
    header.element.style.borderRadius = '0';

    const title = new Base();
    title.createElement('h1');
    title.element.textContent = '📊 IMS 2';

    const nav = new Base();
    nav.createElement('div', 'ui-row');
    nav.element.style.marginBottom = '0';

    const docsBtn = new Button('Documents', App.showDocuments);
    const refsBtn = new Button('References', App.showReferences);
    const warehouseBtn = new Button('Warehouse', App.showWarehouse);
    const logoutBtn = new Button('Logout', () => {
      localStorage.clear();
      App.init();
    });
    logoutBtn.setType('danger');

    nav.append(docsBtn);
    nav.append(refsBtn);
    nav.append(warehouseBtn);
    nav.append(logoutBtn);

    header.append(title);
    header.append(nav);

    app.appendChild(header.getDOMElement());

    // Content area
    const content = new Base();
    content.createElement('div', 'ui-container');
    content.element.id = 'content';

    const welcome = new Base();
    welcome.createElement('h2');
    welcome.element.textContent = `Welcome, ${App.user.im_p}!`;

    const info = new Base();
    info.createElement('p');
    info.element.textContent = `User ID: ${App.kdus}`;

    content.append(welcome);
    content.append(info);

    app.appendChild(content.getDOMElement());
  },

  /**
   * Show documents
   */
  showDocuments: async () => {
    const content = document.getElementById('content');
    content.innerHTML = '';

    const panel = new Panel('Documents');

    try {
      const docs = await API.docs.getAll(App.kdus);

      if (docs && docs.length > 0) {
        const grid = new Grid();

        // Configure headers
        const sampleDoc = docs[0];
        const headers = Object.keys(sampleDoc).map(key => ({
          key: key,
          label: key.toUpperCase(),
          sortable: true,
          width: 'auto'
        }));

        grid.setHeaders(headers);
        grid.setRows(docs);

        // Handle row selection
        grid.on('rowselect', (e) => {
          App.showAlert(
            `Selected document: ${e.detail.row.code || e.detail.row.name}`,
            'info'
          );
        });

        // Add to panel
        panel.setContent(grid.getDOMElement());

        // Add action buttons to footer
        const editBtn = new Button('Edit', () => {
          const selected = grid.getSelectedRows();
          if (selected.length > 0) {
            App.editDocument(selected[0]);
          } else {
            App.showAlert('Please select a document', 'warning');
          }
        });

        const deleteBtn = new Button('Delete', () => {
          const selected = grid.getSelectedRows();
          if (selected.length > 0) {
            Dialog.confirm(
              'Delete Document?',
              async () => {
                try {
                  await API.docs.delete(selected[0].kd_d);
                  App.showAlert('Deleted!', 'success');
                  App.showDocuments();
                } catch (error) {
                  App.showAlert('Error: ' + error.message, 'error');
                }
              }
            );
          } else {
            App.showAlert('Please select documents to delete', 'warning');
          }
        });
        deleteBtn.setType('danger');

        const addBtn = new Button('Add', () => {
          App.addDocument();
        });
        addBtn.setType('success');

        panel.getFooter().appendChild(addBtn.getDOMElement());
        panel.getFooter().appendChild(editBtn.getDOMElement());
        panel.getFooter().appendChild(deleteBtn.getDOMElement());
      } else {
        panel.setContent('<p>No documents found</p>');
      }
    } catch (error) {
      panel.setContent(`<p style="color: red;">Failed to load documents: ${error.message}</p>`);
      App.showAlert('Failed to load documents', 'error');
    }

    content.appendChild(panel.getDOMElement());
  },

  /**
   * Show references
   */
  showReferences: () => {
    const content = document.getElementById('content');
    content.innerHTML = '';

    const title = new Base();
    title.createElement('h2');
    title.element.textContent = 'References';

    const buttonsDiv = new Base();
    buttonsDiv.createElement('div', 'ui-row');

    const partnersBtn = new Button('Search Partners', () => App.searchRef('sprps'));
    const productsBtn = new Button('Search Products', () => App.searchRef('sprim'));
    const warehousesBtn = new Button('Search Warehouses', () => App.searchRef('sprsk'));

    buttonsDiv.append(partnersBtn);
    buttonsDiv.append(productsBtn);
    buttonsDiv.append(warehousesBtn);

    const contentDiv = new Base();
    contentDiv.createElement('div');
    contentDiv.append(title);
    contentDiv.append(buttonsDiv);

    content.appendChild(contentDiv.getDOMElement());
  },

  /**
   * Search reference
   */
  searchRef: async (dir) => {
    const content = document.getElementById('content');
    content.innerHTML = '';

    const panel = new Panel(`Search Reference: ${dir}`);

    const searchInput = new Input('text', 'Type to search...');
    searchInput.element.style.width = '100%';
    searchInput.element.style.marginBottom = '16px';

    const grid = new Grid();
    grid.setHeaders([]);
    grid.setRows([]);

    const gridContainer = new Base();
    gridContainer.createElement('div');
    gridContainer.element.id = 'grid-container';

    // Assemble content
    const contentWrapper = new Base();
    contentWrapper.createElement('div');
    contentWrapper.append(searchInput);
    contentWrapper.append(gridContainer);

    panel.setContent(contentWrapper.getDOMElement());

    // Add action buttons
    const selectBtn = new Button('Select', () => {
      const selected = grid.getSelectedRows();
      if (selected.length > 0) {
        App.showAlert(
          `Selected: ${JSON.stringify(selected[0])}`,
          'success'
        );
      } else {
        App.showAlert('Please select a record', 'warning');
      }
    });
    selectBtn.setType('primary');

    const backBtn = new Button('Back', App.showReferences);

    panel.getFooter().appendChild(selectBtn.getDOMElement());
    panel.getFooter().appendChild(backBtn.getDOMElement());

    content.appendChild(panel.getDOMElement());

    // Search handler
    let searchTimeout;
    searchInput.on('input', async (e) => {
      const value = searchInput.getValue();

      clearTimeout(searchTimeout);

      if (value.length < 2) {
        grid.setRows([]);
        return;
      }

      searchTimeout = setTimeout(async () => {
        try {
          const results = await API.refs.search(dir, value);

          if (results && results.length > 0) {
            const sampleResult = results[0];
            const headers = Object.keys(sampleResult).map(key => ({
              key: key,
              label: key.toUpperCase(),
              sortable: true
            }));

            grid.setHeaders(headers);
            grid.setRows(results);

            gridContainer.clear();
            gridContainer.append(grid);
          } else {
            grid.setRows([]);
          }
        } catch (error) {
          console.error('Search failed:', error);
          App.showAlert('Search failed: ' + error.message, 'error');
        }
      }, 300);
    });

    searchInput.focus();
  },

  /**
   * Show warehouse
   */
  showWarehouse: () => {
    const content = document.getElementById('content');
    content.innerHTML = '';

    const title = new Base();
    title.createElement('h2');
    title.element.textContent = 'Warehouse';

    const text = new Base();
    text.createElement('p');
    text.element.textContent = 'Coming soon...';

    const contentDiv = new Base();
    contentDiv.createElement('div');
    contentDiv.append(title);
    contentDiv.append(text);

    content.appendChild(contentDiv.getDOMElement());
  },

  /**
   * Edit document
   */
  editDocument: (doc) => {
    const dialog = new Dialog('Edit Document');
    dialog.setSize('medium');

    // Create form using UIKit
    const form = new Form();
    form.addField('code', { label: 'Code *', required: true });
    form.addField('date', { label: 'Date', type: 'date' });
    form.setData({ code: doc.code || '', date: doc.date || '' });

    // Additional components
    const supplier = new Dropdown('Select supplier');
    supplier.addOption('55', 'KATTY');
    supplier.addOption('1', 'Supplier A');
    supplier.setValue(doc.supplier || '');

    const comment = new Textarea('Enter comment...');
    comment.setRows(3);
    comment.setValue(doc.comment || '');

    // Build content
    const content = new Base();
    content.createElement('div');
    content.append(form);

    // Add supplier label and field
    const supplierContainer = new Base();
    supplierContainer.createElement('div', 'ui-form-group');
    const supplierLabel = new Base();
    supplierLabel.createElement('label');
    supplierLabel.element.textContent = 'Supplier';
    supplierLabel.element.style.marginBottom = '6px';
    supplierLabel.element.style.display = 'block';
    supplierContainer.append(supplierLabel);
    supplierContainer.append(supplier);
    content.append(supplierContainer);

    // Add comment label and field
    const commentContainer = new Base();
    commentContainer.createElement('div', 'ui-form-group');
    const commentLabel = new Base();
    commentLabel.createElement('label');
    commentLabel.element.textContent = 'Comment';
    commentLabel.element.style.marginBottom = '6px';
    commentLabel.element.style.display = 'block';
    commentContainer.append(commentLabel);
    commentContainer.append(comment);
    content.append(commentContainer);

    dialog.setContent(content.getDOMElement());

    const saveBtn = new Button('Save', async () => {
      if (!form.validate()) return;

      try {
        const data = form.getData();
        await API.docs.update(doc.kd_d, {
          code: data.code,
          date: data.date || doc.date,
          supplier: supplier.getValue() || doc.supplier,
          comment: comment.getValue()
        });
        App.showAlert('Saved!', 'success');
        dialog.close();
        App.showDocuments();
      } catch (error) {
        App.showAlert('Error: ' + error.message, 'error');
      }
    });
    saveBtn.setType('primary');

    const cancelBtn = new Button('Cancel', () => {
      dialog.close();
    });

    dialog.getFooter().appendChild(saveBtn.getDOMElement());
    dialog.getFooter().appendChild(cancelBtn.getDOMElement());

    document.body.appendChild(dialog.getDOMElement());
    dialog.show();
  },

  /**
   * Add new document
   */
  addDocument: () => {
    const dialog = new Dialog('Add Document');
    dialog.setSize('medium');

    // Create form using UIKit
    const form = new Form();
    form.addField('code', { label: 'Code *', required: true });
    form.addField('date', { label: 'Date', type: 'date' });

    // Additional components
    const supplier = new Dropdown('Select supplier');
    supplier.addOption('55', 'KATTY');
    supplier.addOption('1', 'Supplier A');
    supplier.setValue(App.kdus);

    const comment = new Textarea('Enter comment...');
    comment.setRows(3);

    // Build content
    const content = new Base();
    content.createElement('div');
    content.append(form);

    // Add supplier label and field
    const supplierContainer = new Base();
    supplierContainer.createElement('div', 'ui-form-group');
    const supplierLabel = new Base();
    supplierLabel.createElement('label');
    supplierLabel.element.textContent = 'Supplier';
    supplierLabel.element.style.marginBottom = '6px';
    supplierLabel.element.style.display = 'block';
    supplierContainer.append(supplierLabel);
    supplierContainer.append(supplier);
    content.append(supplierContainer);

    // Add comment label and field
    const commentContainer = new Base();
    commentContainer.createElement('div', 'ui-form-group');
    const commentLabel = new Base();
    commentLabel.createElement('label');
    commentLabel.element.textContent = 'Comment';
    commentLabel.element.style.marginBottom = '6px';
    commentLabel.element.style.display = 'block';
    commentContainer.append(commentLabel);
    commentContainer.append(comment);
    content.append(commentContainer);

    dialog.setContent(content.getDOMElement());

    const saveBtn = new Button('Save', async () => {
      if (!form.validate()) return;

      try {
        const data = form.getData();
        await API.docs.add({
          code: data.code,
          date: data.date || new Date().toISOString().split('T')[0],
          supplier: supplier.getValue() || App.kdus,
          comment: comment.getValue(),
          kdus: App.kdus
        });
        App.showAlert('Created!', 'success');
        dialog.close();
        App.showDocuments();
      } catch (error) {
        App.showAlert('Error: ' + error.message, 'error');
      }
    });
    saveBtn.setType('primary');

    const cancelBtn = new Button('Cancel', () => {
      dialog.close();
    });

    dialog.getFooter().appendChild(saveBtn.getDOMElement());
    dialog.getFooter().appendChild(cancelBtn.getDOMElement());

    document.body.appendChild(dialog.getDOMElement());
    dialog.show();
  },

  /**
   * Show alert
   */
  showAlert: (message, type = 'info') => {
    const alert = document.createElement('div');
    alert.className = `ui-alert ui-alert-${type}`;
    alert.textContent = message;
    document.body.insertBefore(alert, document.body.firstChild);
    setTimeout(() => alert.remove(), 3000);
  }
};
