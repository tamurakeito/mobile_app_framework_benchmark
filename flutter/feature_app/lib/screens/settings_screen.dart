import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  late SharedPreferences _prefs;
  bool _isLoading = true;

  // 設定値
  bool _notificationsEnabled = true;
  String _username = '';
  double _fontSize = 16.0;
  String _theme = 'system';

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    _prefs = await SharedPreferences.getInstance();

    setState(() {
      _notificationsEnabled = _prefs.getBool('notifications_enabled') ?? true;
      _username = _prefs.getString('username') ?? '';
      _fontSize = _prefs.getDouble('font_size') ?? 16.0;
      _theme = _prefs.getString('theme') ?? 'system';
      _isLoading = false;
    });
  }

  Future<void> _saveNotifications(bool value) async {
    await _prefs.setBool('notifications_enabled', value);
    setState(() => _notificationsEnabled = value);
    _showSnackBar('通知設定を保存しました');
  }

  Future<void> _saveUsername(String value) async {
    await _prefs.setString('username', value);
    setState(() => _username = value);
    _showSnackBar('ユーザー名を保存しました');
  }

  Future<void> _saveFontSize(double value) async {
    await _prefs.setDouble('font_size', value);
    setState(() => _fontSize = value);
  }

  Future<void> _saveTheme(String value) async {
    await _prefs.setString('theme', value);
    setState(() => _theme = value);
    _showSnackBar('テーマを保存しました');
  }

  Future<void> _clearAllSettings() async {
    await _prefs.clear();
    setState(() {
      _notificationsEnabled = true;
      _username = '';
      _fontSize = 16.0;
      _theme = 'system';
    });
    _showSnackBar('すべての設定をクリアしました');
  }

  void _showSnackBar(String message) {
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(message), duration: const Duration(seconds: 1)),
      );
    }
  }

  void _showUsernameDialog() {
    final controller = TextEditingController(text: _username);
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('ユーザー名'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(
            hintText: 'ユーザー名を入力',
            border: OutlineInputBorder(),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('キャンセル'),
          ),
          TextButton(
            onPressed: () {
              _saveUsername(controller.text);
              Navigator.pop(context);
            },
            child: const Text('保存'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Settings'),
          backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        ),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_outline),
            onPressed: () {
              showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('設定をクリア'),
                  content: const Text('すべての設定を初期値に戻しますか？'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('キャンセル'),
                    ),
                    TextButton(
                      onPressed: () {
                        _clearAllSettings();
                        Navigator.pop(context);
                      },
                      child: const Text('クリア'),
                    ),
                  ],
                ),
              );
            },
            tooltip: '設定をクリア',
          ),
        ],
      ),
      body: ListView(
        children: [
          // ユーザー設定セクション
          const Padding(
            padding: EdgeInsets.all(16),
            child: Text(
              'ユーザー設定',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
                color: Colors.grey,
              ),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.person),
            title: const Text('ユーザー名'),
            subtitle: Text(_username.isEmpty ? '未設定' : _username),
            trailing: const Icon(Icons.chevron_right),
            onTap: _showUsernameDialog,
          ),
          const Divider(),

          // 通知設定セクション
          const Padding(
            padding: EdgeInsets.all(16),
            child: Text(
              '通知設定',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
                color: Colors.grey,
              ),
            ),
          ),
          SwitchListTile(
            secondary: const Icon(Icons.notifications),
            title: const Text('通知を有効にする'),
            subtitle: Text(_notificationsEnabled ? 'オン' : 'オフ'),
            value: _notificationsEnabled,
            onChanged: _saveNotifications,
          ),
          const Divider(),

          // 表示設定セクション
          const Padding(
            padding: EdgeInsets.all(16),
            child: Text(
              '表示設定',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
                color: Colors.grey,
              ),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.text_fields),
            title: const Text('フォントサイズ'),
            subtitle: Slider(
              value: _fontSize,
              min: 12,
              max: 24,
              divisions: 6,
              label: '${_fontSize.round()}',
              onChanged: _saveFontSize,
            ),
          ),
          ListTile(
            leading: const Icon(Icons.palette),
            title: const Text('テーマ'),
            subtitle: Text(
              _theme == 'light'
                  ? 'ライト'
                  : _theme == 'dark'
                      ? 'ダーク'
                      : 'システム設定に従う',
            ),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              showModalBottomSheet(
                context: context,
                builder: (context) => Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    ListTile(
                      leading: const Icon(Icons.brightness_auto),
                      title: const Text('システム設定に従う'),
                      trailing:
                          _theme == 'system' ? const Icon(Icons.check) : null,
                      onTap: () {
                        _saveTheme('system');
                        Navigator.pop(context);
                      },
                    ),
                    ListTile(
                      leading: const Icon(Icons.light_mode),
                      title: const Text('ライト'),
                      trailing:
                          _theme == 'light' ? const Icon(Icons.check) : null,
                      onTap: () {
                        _saveTheme('light');
                        Navigator.pop(context);
                      },
                    ),
                    ListTile(
                      leading: const Icon(Icons.dark_mode),
                      title: const Text('ダーク'),
                      trailing:
                          _theme == 'dark' ? const Icon(Icons.check) : null,
                      onTap: () {
                        _saveTheme('dark');
                        Navigator.pop(context);
                      },
                    ),
                  ],
                ),
              );
            },
          ),
          const Divider(),

          // 情報セクション
          const Padding(
            padding: EdgeInsets.all(16),
            child: Text(
              'ストレージ情報',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
                color: Colors.grey,
              ),
            ),
          ),
          const ListTile(
            leading: Icon(Icons.storage),
            title: Text('ストレージ方式'),
            subtitle: Text('SharedPreferences'),
          ),
          ListTile(
            leading: const Icon(Icons.info_outline),
            title: const Text('保存されている値'),
            subtitle: Text(
              'notifications: $_notificationsEnabled\n'
              'username: ${_username.isEmpty ? "(空)" : _username}\n'
              'fontSize: $_fontSize\n'
              'theme: $_theme',
            ),
          ),
        ],
      ),
    );
  }
}
