package com.aptitekk.aptibook.web;

import com.aptitekk.aptibook.core.domain.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@RestController
public class TagController {

    private List<Tag> tags = new ArrayList<>();

    private final HttpServletRequest httpServletRequest;

    @Autowired
    public TagController(HttpServletRequest httpServletRequest) {
        this.httpServletRequest = httpServletRequest;
    }

    @RequestMapping(
            value = "tags",
            method = RequestMethod.GET
    )
    public ResponseEntity<List<Tag>> getTags() {
        System.out.println("Getting from "+httpServletRequest.getAttribute("tenant"));
        return new ResponseEntity<>(tags, HttpStatus.OK);
    }

    @RequestMapping(
            value = "tags",
            method = RequestMethod.POST
    )
    @ResponseBody
    public ResponseEntity<List<Tag>> addTag(@RequestBody Tag tag) {
        tag.setId((int) (Math.random() * 10000));
        this.tags.add(tag);
        return getTags();
    }

    @RequestMapping(
            value = "tags/{id}",
            method = RequestMethod.DELETE
    )
    @ResponseBody
    public ResponseEntity<List<Tag>> deleteTag(@PathVariable("id") Integer id) {
        if (id != null) {
            Iterator<Tag> iterator = tags.iterator();
            while (iterator.hasNext()) {
                if (iterator.next().getId() == id) {
                    iterator.remove();
                    break;
                }
            }
        }

        return getTags();
    }

}