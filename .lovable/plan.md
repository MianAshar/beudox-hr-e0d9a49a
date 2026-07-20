## Fix
In `src/pages/InvoiceForm.tsx` line 147, the auto-generated invoice number template is `${prefix}-INV-${year}-${seq}`, which duplicates `INV` when `invoice_prefix` is already `INV` (the default). Change it to `${prefix}-${year}-${seq}` so only the configured prefix is used.

No other changes.