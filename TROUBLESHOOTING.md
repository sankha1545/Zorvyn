# 💡 Troubleshooting Guide - FinTrack

Solutions to common issues and problems.

---

## 🚀 Getting Started Issues

### Issue: Dependencies not installing

**Error:** `npm ERR! code ERESOLVE`

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Install with legacy peer deps
npm install --legacy-peer-deps

# Or use Node 18+
node --version  # Should be v18.0.0+
```

### Issue: Port 3000 already in use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solutions:**
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port:
npm run dev -- --host 0.0.0.0 --port 3001
```

### Issue: Vite server not starting

**Error:** `Error: ENOENT: no such file or directory`

**Solutions:**
```bash
# Reinstall node_modules
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite

# Restart dev server
npm run dev
```

---

## 🔍 Feature Issues

### Issue: Filters not working

**Symptoms:** Filters applied but results unchanged

**Solutions:**

1. **Clear active filters:**
   - Click "Clear All" button
   - Refresh the page

2. **Check filter values:**
   - Verify filter selection is correct
   - Date format should be YYYY-MM-DD
   - Amount should be numeric

3. **Reset search:**
   - Clear search input
   - Make sure global search is empty

**Debug:**
```javascript
// In console, check store state:
import useStore from '@/store/useStore';
const state = useStore.getState();
console.log(state.transactions); // All transactions
console.log(state.globalSearch); // Current search
```

### Issue: Sorting not working

**Symptoms:** Clicking sort header does nothing

**Solutions:**

1. **Refresh table:**
   - Click different column header first
   - Then click desired column

2. **Check column:**
   - Only Date and Amount are sortable
   - Description sorting may need implementation

3. **Verify data:**
   - Make sure transactions exist
   - Check browser console for errors

**Debug:**
```javascript
// Verify sort state:
console.log('Sort field:', sortField);
console.log('Sort direction:', sortDirection);
```

### Issue: Transactions not displaying

**Symptoms:** Empty table with "No transactions" message

**Solutions:**

1. **Initialize store:**
   ```javascript
   const initializeTransactions = useStore((s) => s.initializeTransactions);
   useEffect(() => {
     initializeTransactions();
   }, []);
   ```

2. **Check mock data:**
   - Verify mockData.js has transactions
   - Check transaction structure

3. **Verify filters:**
   - Clear all filters
   - Check if excessive filters hiding all results

4. **Look for console errors:**
   - Open DevTools (F12 → Console)
   - Look for red error messages

---

## 🎨 UI/UX Issues

### Issue: Styles not applying

**Symptoms:** Missing colors, broken layout

**Solutions:**

1. **Hard refresh:**
   - Firefox/Chrome: Ctrl + Shift + R
   - Safari: Cmd + Shift + R
   - Edge: Ctrl + Shift + Delete

2. **Clear cache:**
   ```bash
   # Clear browser cache
   # Or manually in DevTools:
   # Storage → Clear Site Data
   ```

3. **Rebuild with Vite:**
   ```bash
   npm run build
   npm run preview
   ```

4. **Check Tailwind:**
   - Verify tailwind.config.js
   - Check CSS imports in index.css

### Issue: Theme not toggling

**Symptoms:** Dark/Light mode button not working

**Solutions:**

1. **Check localStorage:**
   ```javascript
   // In console:
   localStorage.getItem('fintrack-theme'); // Should show 'dark' or 'light'
   localStorage.removeItem('fintrack-theme'); // Reset theme
   ```

2. **Verify hook:**
   ```javascript
   const theme = useStore((s) => s.theme);
   const toggleTheme = useStore((s) => s.toggleTheme);
   console.log('Current theme:', theme); // Should be 'dark' or 'light'
   ```

3. **Restart app:**
   - Refresh browser
   - Restart dev server

### Issue: Modal not opening

**Symptoms:** Button clicked but modal doesn't appear

**Solutions:**

1. **Check state:**
   ```javascript
   console.log('isModalOpen:', isModalOpen); // Should toggle on click
   ```

2. **Verify onClick handler:**
   ```javascript
   <button onClick={() => setIsModalOpen(true)}>
     {/* Make sure handler is correct */}
   </button>
   ```

3. **Check z-index:**
   - Modal may be behind other elements
   - Verify z-50 class is applied

---

## 📊 Data Issues

### Issue: Data disappears after refresh

**Symptoms:** Transactions exist, but refresh clears them

**Expected behavior:** Session data clears on page refresh (this is normal for mock API)

**Solutions:**

1. **Understand mock behavior:**
   - Data persists during single session
   - Refreshing page reloads mock data
   - This is expected behavior

2. **For persistence:**
   - Would need backend database
   - Or localStorage implementation
   - Currently intentional design

### Issue: Wrong calculation in analytics

**Symptoms:** Total balance incorrect

**Solutions:**

1. **Check transaction amounts:**
   ```javascript
   const sum = transactions.reduce((acc, tx) => {
     return tx.type === 'Income' ? acc + tx.amount : acc - tx.amount;
   }, 0);
   console.log('Calculated balance:', sum);
   ```

2. **Verify data types:**
   - Amount should be number, not string
   - Check for NaN values

3. **Check status filtering:**
   - Only 'Completed' should be included
   - Verify pending filter logic

---

## 📤 Export Issues

### Issue: CSV export not downloading

**Symptoms:** Clicked export but no file downloads

**Solutions:**

1. **Check browser settings:**
   - Allow downloads from localhost
   - Pop-up blocker not blocking

2. **Check console:**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

3. **Manually test:**
   ```javascript
   import { exportToCSV } from '@/utils/csvExport';
   const testData = [{ A: 1, B: 2 }];
   exportToCSV(testData, 'test.csv'); // Should download
   ```

4. **Browser compatibility:**
   - Use modern browser (Chrome, Firefox, Edge, Safari)
   - Old IE/Safari versions may not support

### Issue: CSV data formatting wrong

**Symptoms:** Currency, dates formatted incorrectly

**Solutions:**

1. **Check format functions:**
   ```javascript
   import { formatCurrencyForCSV, formatDateForCSV } from '@/utils/csvExport';
   console.log(formatCurrencyForCSV(50)); // Should be "$50.00"
   console.log(formatDateForCSV('2026-04-02')); // Should be "04/02/2026"
   ```

2. **Verify data mapping:**
   ```javascript
   const data = transactions.map(tx => ({
     Date: formatDateForCSV(tx.date),
     Amount: formatCurrencyForCSV(tx.amount)
   }));
   ```

---

## 🔐 Role & Access Issues

### Issue: Admin button not showing for viewer

**Symptoms:** "Add Transaction" button hidden but should show for admin

**Solutions:**

1. **Check role:**
   ```javascript
   const role = useStore((s) => s.role);
   console.log('Current role:', role); // Should be 'admin'
   ```

2. **Switch role:**
   - Click role switcher in topbar
   - Select Admin
   - Try again

3. **Verify RoleGuard:**
   ```jsx
   <RoleGuard requiredRole="admin">
     <button>Add</button> {/* Only shows for admin */}
   </RoleGuard>
   ```

### Issue: Viewer can edit transactions

**Symptoms:** Viewer has admin capabilities

**Solutions:**

1. **Check role enforcement:**
   - Verify RoleGuard wraps edit button
   - Check store role value

2. **Hard refresh:**
   - Ctrl + Shift + R
   - Clear session state

3. **Manual test:**
   ```javascript
   const role = useStore((s) => s.role);
   if (role === 'viewer') {
     // Edit should be disabled
   }
   ```

---

## 🔔 Notification Issues

### Issue: Toast messages not showing

**Symptoms:** Actions complete but no notification

**Solutions:**

1. **Check component mount:**
   ```javascript
   const [toast, setToast] = useState(null);
   return (
     <>
       {toast && <Toast message={toast.message} type={toast.type} />}
     </>
   );
   ```

2. **Verify setToast called:**
   ```javascript
   setToast({ message: 'Success!', type: 'success' });
   setTimeout(() => setToast(null), 3000); // Auto clear
   ```

### Issue: Notification badge not updating

**Symptoms:** Bell icon doesn't show unread count

**Solutions:**

1. **Check badge logic:**
   ```javascript
   const unreadCount = notifications.filter(n => !n.read).length;
   console.log('Unread:', unreadCount); // Should be > 0
   ```

2. **Trigger notification:**
   ```javascript
   const addNotification = useStore((s) => s.addNotification);
   addNotification({
     id: Date.now(),
     type: 'info',
     title: 'Test',
     message: 'Test notification',
     read: false,
     timestamp: new Date()
   });
   ```

---

## 🔍 Console Debugging

### Enable Debug Mode

```javascript
// Add to useStore.js to log all state changes:
const useStore = create((set, get) => ({
  // ... store code
}), {
  name: 'fintrack-store',
  serialize: (state) => {
    console.log('State update:', state);
    return state;
  }
});
```

### Check Store State

```javascript
// In browser console:
import useStore from '@/store/useStore';
const state = useStore.getState();
console.log(state); // All state
console.log(state.transactions); // Just transactions
console.log(state.theme); // Just theme
```

### Monitor API Calls

```javascript
// In DevTools Network tab:
// 1. Open DevTools (F12)
// 2. Click Network tab
// 3. Perform action
// Check API calls + responses
```

---

## 🆘 Getting Help

### Debugging Checklist

Before reporting issues:

- [ ] Clear browser cache (Ctrl+Shift+R)
- [ ] Restart dev server (npm run dev)
- [ ] Check browser console for errors (F12)
- [ ] Verify Node version (node --version → v18+)
- [ ] Clear node_modules (rm -rf && npm install)
- [ ] Check if issue reproducible consistently
- [ ] Try in different browser
- [ ] Check documentation files

### Where to Look

1. **Console errors:** F12 → Console tab
2. **Network issues:** F12 → Network tab
3. **State issues:** Use store debugging above
4. **Component issues:** F12 → Elements tab
5. **Performance:** F12 → Performance tab

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| Unexpected token < | HTML returned instead of JS | Check API endpoint |
| Cannot read property of undefined | State not initialized | Call init function |
| CORS error | Cross-origin request | Not applicable (mock API) |
| undefined is not a function | Hook used incorrectly | Check hook import |

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Browser DevTools Guide](https://developer.chrome.com/docs/devtools/)

---

**Last Updated:** April 2, 2026 | **Version:** 1.0

Still having issues? Check the other documentation files or review the source code comments.
