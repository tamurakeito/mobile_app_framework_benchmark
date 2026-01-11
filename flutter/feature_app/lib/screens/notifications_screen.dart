import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final FlutterLocalNotificationsPlugin _notifications =
      FlutterLocalNotificationsPlugin();
  bool _isInitialized = false;
  String _status = '初期化中...';

  @override
  void initState() {
    super.initState();
    _initializeNotifications();
  }

  Future<void> _initializeNotifications() async {
    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );
    const initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    final result = await _notifications.initialize(
      initSettings,
      onDidReceiveNotificationResponse: (response) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('通知がタップされました: ${response.payload ?? ""}')),
          );
        }
      },
    );

    if (mounted) {
      setState(() {
        _isInitialized = result ?? false;
        _status = _isInitialized ? '準備完了' : '初期化に失敗しました';
      });
    }
  }

  Future<void> _showNotification() async {
    if (!_isInitialized) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('通知が初期化されていません')),
      );
      return;
    }

    const androidDetails = AndroidNotificationDetails(
      'feature_app_channel',
      'Feature App通知',
      channelDescription: 'Feature Appからの通知',
      importance: Importance.high,
      priority: Priority.high,
    );
    const iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );
    const details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _notifications.show(
      DateTime.now().millisecondsSinceEpoch ~/ 1000,
      'テスト通知',
      'これはFlutterからの通知です！ ${DateTime.now().toString().substring(11, 19)}',
      details,
      payload: 'notification_payload',
    );

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('通知を送信しました')),
      );
    }
  }

  Future<void> _scheduleNotification() async {
    if (!_isInitialized) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('通知が初期化されていません')),
      );
      return;
    }

    const androidDetails = AndroidNotificationDetails(
      'feature_app_channel',
      'Feature App通知',
      channelDescription: 'Feature Appからの通知',
      importance: Importance.high,
      priority: Priority.high,
    );
    const iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );
    const details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    // 5秒後に通知を表示
    await Future.delayed(const Duration(seconds: 5));

    await _notifications.show(
      DateTime.now().millisecondsSinceEpoch ~/ 1000,
      'スケジュール通知',
      '5秒後に届く通知です！',
      details,
      payload: 'scheduled_notification',
    );

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('5秒後に通知が届きます')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // ステータス表示
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Icon(
                      _isInitialized ? Icons.check_circle : Icons.pending,
                      color: _isInitialized ? Colors.green : Colors.orange,
                    ),
                    const SizedBox(width: 12),
                    Text(
                      'ステータス: $_status',
                      style: const TextStyle(fontSize: 16),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            // 即時通知ボタン
            ElevatedButton.icon(
              onPressed: _isInitialized ? _showNotification : null,
              icon: const Icon(Icons.notifications_active),
              label: const Text('今すぐ通知を送信'),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
            ),
            const SizedBox(height: 12),
            // スケジュール通知ボタン
            OutlinedButton.icon(
              onPressed: _isInitialized ? _scheduleNotification : null,
              icon: const Icon(Icons.schedule),
              label: const Text('5秒後に通知を送信'),
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
            ),
            const SizedBox(height: 32),
            // 説明テキスト
            const Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '通知機能について',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      '• ローカル通知の送信\n'
                      '• スケジュール通知\n'
                      '• 通知タップ時のコールバック',
                      style: TextStyle(color: Colors.grey),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
