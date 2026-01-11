import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';

final dioProvider = Provider<Dio>((ref) {
  return Dio(BaseOptions(
    baseUrl: 'https://jsonplaceholder.typicode.com',
    connectTimeout: const Duration(seconds: 5),
    receiveTimeout: const Duration(seconds: 3),
  ));
});

class User {
  final int id;
  final String name;
  final String email;

  User({required this.id, required this.name, required this.email});

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      name: json['name'],
      email: json['email'],
    );
  }
}

final usersProvider = FutureProvider<List<User>>((ref) async {
  final dio = ref.watch(dioProvider);
  final response = await dio.get('/users');
  return (response.data as List).map((json) => User.fromJson(json)).toList();
});

final createUserProvider = Provider<Future<User> Function(String name, String email)>((ref) {
  final dio = ref.watch(dioProvider);
  return (String name, String email) async {
    final response = await dio.post('/users', data: {
      'name': name,
      'email': email,
    });
    return User.fromJson(response.data);
  };
});
