<Route
  path="/admin/events"
  element={
    <ProtectedRoute>
      <AdminEvents />
    </ProtectedRoute>
  }
/>
