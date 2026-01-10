import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Feature App'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildMenuCard(
            context,
            icon: Icons.add_circle_outline,
            title: 'Counter',
            subtitle: '状態管理の検証',
            route: '/counter',
          ),
          _buildMenuCard(
            context,
            icon: Icons.cloud_outlined,
            title: 'API',
            subtitle: 'REST API通信の検証',
            route: '/api',
          ),
          _buildMenuCard(
            context,
            icon: Icons.camera_alt_outlined,
            title: 'Camera',
            subtitle: 'カメラ撮影機能',
            route: '/camera',
          ),
          _buildMenuCard(
            context,
            icon: Icons.notifications_outlined,
            title: 'Notifications',
            subtitle: 'プッシュ通知のテスト',
            route: '/notifications',
          ),
          _buildMenuCard(
            context,
            icon: Icons.settings_outlined,
            title: 'Settings',
            subtitle: 'テーマ切り替え',
            route: '/settings',
          ),
        ],
      ),
    );
  }

  Widget _buildMenuCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required String route,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Icon(icon, size: 32),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.chevron_right),
        onTap: () => context.push(route),
      ),
    );
  }
}
