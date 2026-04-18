self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    
    let data = {};
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data = {
                title: 'CodeStorm Update',
                body: event.data.text()
            };
        }
    }

    const title = data.title || 'CodeStorm Update';
    const link = data.data?.link || '/discussion';
    
    const options = {
        body: data.body || 'You have a new update.',
        icon: '/codestorm_logo.png',
        badge: '/codestorm_logo.png',
        data: { link },
        vibrate: [200, 100, 200],
        tag: data.tag || 'codestorm-notification',
        renotify: true,
        requireInteraction: true,
        actions: [
            { action: 'open', title: 'View Update' },
            { action: 'close', title: 'Dismiss' }
        ]
    };

    // Optimization: Don't show notification if user is already looking at the relevant page
    const promiseChain = clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then((windowClients) => {
        let isVisible = false;
        for (let i = 0; i < windowClients.length; i++) {
            const client = windowClients[i];
            if (client.url.includes(link) && client.visibilityState === 'visible') {
                isVisible = true;
                break;
            }
        }

        if (isVisible) {
            console.log('[Service Worker] Notification suppressed: Page is already open and visible.');
            return;
        }

        return self.registration.showNotification(title, options);
    });

    event.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    if (event.action === 'close') return;

    const link = event.notification.data?.link || '/discussion';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                // Check if current tab is active and on the right page
                if (client.url.includes(link) && 'focus' in client) {
                    return client.focus();
                }
            }
            // If no tab is open, open a new one
            if (clients.openWindow) {
                return clients.openWindow(link);
            }
        })
    );
});
