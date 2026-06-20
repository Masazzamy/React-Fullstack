<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_api_flow()
    {
        // 1. Register
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);
        $response->assertStatus(201)->assertJsonStructure(['user', 'token']);
        $token = $response->json('token');

        // 2. Login
        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);
        $response->assertStatus(200)->assertJsonStructure(['user', 'token']);

        // 3. Create Post
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/post', [
            'title' => 'My first post',
            'body' => 'This is the body of my first post',
        ]);
        $response->assertStatus(201)->assertJsonFragment(['title' => 'My first post']);
        $postId = $response->json('id');

        // 4. Get Posts
        $response = $this->getJson('/api/post');
        $response->assertStatus(200);
        $this->assertCount(1, $response->json());

        // 5. Update Post
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson("/api/post/{$postId}", [
            'title' => 'Updated post',
            'body' => 'Updated body',
        ]);
        $response->assertStatus(200)->assertJsonFragment(['title' => 'Updated post']);

        // 6. Delete Post
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson("/api/post/{$postId}");
        $response->assertStatus(200)->assertJson(['message' => 'Post deleted successfully']);
    }
}
