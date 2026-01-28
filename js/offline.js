const queue = [];

export function enqueue(task) {
  queue.push(task);
}

function flushQueue() {
  const copy = [...queue];
  queue.length = 0;
  copy.reduce((p, t) => p.then(() => t()), Promise.resolve()).catch((e) => {
    console.error("Queue run error:", e);
  });
}

export function setupOfflineHandlers() {
  window.addEventListener("online", flushQueue);
  window.addEventListener("offline", () => {
    console.warn("Device offline. Actions will wait.");
  });
}

export function isOnline() {
  return navigator.onLine;
}
