package com.captoneprojec.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class JwtUtil {
    private final String SECRET = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz";
    private final long expirationTime = 1000 * 60 * 60;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    public String generateToken(UserDetails userDetails, String UserID) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities().stream().map(Object::toString).toList());
        claims.put("userId", UserID);

        String token = Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("roles", userDetails.getAuthorities().stream().map(Object::toString).toList())
                .claim("userId", UserID)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(SignatureAlgorithm.HS256, SECRET)
                .compact();
        return token;
    }

    public String extractUsername(String token) {

        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(SECRET)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String username = claims.getSubject();
            return username;

        } catch (Exception e) {
            System.out.println("Token Parsing Error: " + e.getMessage());
            return null;
        }

    }

    public List<String> extractRoles(String token) {
        return (List<String>) Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token).getBody().get("roles");
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        boolean isValid = extractUsername(token).equals(userDetails.getUsername());
        System.out.println("token is valid : " + isValid);
        return isValid;
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Date extractExpiration(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET)
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }


}
