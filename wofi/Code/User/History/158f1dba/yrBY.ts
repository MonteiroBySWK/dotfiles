class NotificationService implements INotificationService {
  showError(message: string): void {
    alert(`Erro: ${message}`);
  }

  showSuccess(message: string): void {
    alert(`Sucesso: ${message}`);
  }
}
